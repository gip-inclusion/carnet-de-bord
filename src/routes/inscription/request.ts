import { getAppUrl } from '$lib/config/variables/private';
import send from '$lib/emailing';
import {
	GetAccountByEmailDocument,
	GetAccountByUsernameDocument,
	GetDeploymentManagersForStructureDocument,
	InsertProfessionalAccountDocument,
} from '$lib/graphql/_gen/typed-document-nodes';
import type {
	Account,
	GetAccountByEmailQuery,
	GetAccountByUsernameQuery,
	GetDeploymentManagersForStructureQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { RequestHandler } from '@sveltejs/kit';
import { updateAccessKey } from '$lib/services/account';
import * as yup from 'yup';
import { adminClient } from '$lib/graphql/adminClient';

const inscriptionRequestSchema = yup.object().shape({
	accountRequest: yup.object().shape({
		email: yup.string().required(),
		firstname: yup.string().required(),
		lastname: yup.string().required(),
		mobileNumber: yup.string(),
		position: yup.string(),
	}),
	structureId: yup.string().required(),
	autoConfirm: yup.boolean().nullable(),
	requester: yup
		.object()
		.shape({
			firstname: yup.string().required(),
			lastname: yup.string().required(),
		})
		.nullable(),
});
type InscriptionRequest = yup.InferType<typeof inscriptionRequestSchema>;

const validateBody = (body: unknown): body is InscriptionRequest => {
	return inscriptionRequestSchema.isValidSync(body);
};

export const post: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (!validateBody(body)) {
		return {
			status: 400,
			body: {
				errors: 'INVALID_BODY',
			},
		};
	}

	const { accountRequest, structureId, requester, autoConfirm } = body;

	const { email, firstname, lastname, mobileNumber, position } = accountRequest;
	let [username] = email.split('@');

	const client = adminClient();

	const emailResult = await client
		.query<GetAccountByEmailQuery>(GetAccountByEmailDocument, {
			criteria: {
				_or: [
					{ beneficiary: { email: { _eq: username } } },
					{ professional: { email: { _eq: username } } },
					{ manager: { email: { _eq: username } } },
					{ admin: { email: { _eq: username } } },
				],
			},
		})
		.toPromise();

	if (emailResult.error || !emailResult.data) {
		console.error(emailResult);
		return {
			status: 500,
			body: {
				errors: 'SERVER_ERROR',
			},
		};
	}

	if (emailResult.data.account.length > 0) {
		console.error(`l'email ${email} est déjà utilisé`);
		return {
			status: 400,
			body: {
				errors: { email: 'Cet email est déjà utilisé.' },
			},
		};
	}

	const { error, data } = await client
		.query<GetAccountByUsernameQuery>(GetAccountByUsernameDocument, {
			comp: { _ilike: `${username.toLowerCase()}%` },
		})
		.toPromise();

	if (error || !data) {
		console.error(error);
		return {
			status: 500,
			body: {
				errors: 'SERVER_ERROR',
			},
		};
	}

	if (data.account.length > 0) {
		username = createUsername(data.account, username);
	}
	username = username.toLowerCase();

	const insertResult = await client
		.mutation(InsertProfessionalAccountDocument, {
			account: {
				username,
				confirmed: Boolean(autoConfirm),
				type: 'professional',
				professional: {
					data: {
						email: email.toLowerCase(),
						firstname,
						lastname,
						mobileNumber,
						position,
						structureId,
					},
				},
			},
		})
		.toPromise();

	if (insertResult.error || !insertResult.data) {
		return {
			status: 500,
			body: {
				errors: 'INSERTION_ERROR',
			},
		};
	}

	const { account } = insertResult.data;

	if (autoConfirm) {
		const result = await updateAccessKey(client, account.id);
		if (result.error) {
			console.error('login', result.error);
			return {
				status: 500,
				body: {
					errors: 'SERVER_ERROR',
				},
			};
		}
		const accessKey = result.data.account.accessKey;
		send({
			options: {
				to: email,
				subject: 'Création de compte sur Carnet de bord',
			},
			template: 'accountCreatedByAdmin',
			params: [
				{
					account: {
						username,
						firstname,
						lastname,
					},
					url: {
						accessKey,
						appUrl: getAppUrl(),
					},
				},
			],
		}).catch((emailError) => {
			console.error(emailError);
		});
	} else {
		// send email to all deployment managers for the target structure
		const { error, data } = await client
			.query<GetDeploymentManagersForStructureQuery>(GetDeploymentManagersForStructureDocument, {
				structureId,
			})
			.toPromise();
		if (error) {
			// instead of erroring for the end-user (in spite of the accounts having been created in actuality),
			// we should return a success and send an admin-level error to handle notifying the managers
			return {
				status: 500,
				body: {
					errors: 'SERVER_ERROR',
				},
			};
		}

		const emails: string[] = data?.structure?.deployment?.managers?.map(({ email }) => email);
		sendEmailNotifications(emails, accountRequest, requester);
	}

	return {
		status: 200,
		body: { professionalId: account.professional.id },
	};
};

function createUsername(accounts: Pick<Account, 'username'>[], username: string): string {
	const matcher = new RegExp(`^${username}(\\d*)$`);
	const index = accounts.reduce((maxIndex, item) => {
		const matched = item.username.match(matcher);
		if (!matched) {
			return maxIndex;
		}
		if (isNaN(parseInt(matched[1]))) {
			return maxIndex;
		}
		return Math.max(parseInt(matched[1]), maxIndex);
	}, 0);
	return `${username}${index + 1}`;
}

function sendEmailNotifications(
	emails: string[],
	accountRequest: InscriptionRequest['accountRequest'],
	requester: InscriptionRequest['requester']
) {
	const appUrl = getAppUrl();
	for (const email of emails) {
		send({
			options: {
				to: email,
				subject: 'Demande de création de compte',
			},
			template: 'accountRequest',
			params: [
				{
					pro: {
						firstname: accountRequest.firstname,
						lastname: accountRequest.lastname,
					},
					url: {
						appUrl,
					},
					requester,
				},
			],
		}).catch((emailError) => {
			console.error(emailError);
		});
	}
}
