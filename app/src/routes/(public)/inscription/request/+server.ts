import { json, error } from '@sveltejs/kit';
import { getGraphqlAPI, getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import send from '$lib/emailing';
import {
	GetAccountByEmailDocument,
	GetAccountByUsernameDocument,
	GetDeploymentManagersForStructureDocument,
	InsertProfessionalAccountDocument,
	RoleEnum,
} from '$lib/graphql/_gen/typed-document-nodes';
import type {
	Account,
	GetAccountByEmailQuery,
	GetAccountByUsernameQuery,
	GetDeploymentManagersForStructureQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { RequestHandler } from '@sveltejs/kit';
import { updateAccessKey } from '$lib/services/account';
import { createClient } from '@urql/core';
import * as yup from 'yup';
import { logger } from '$lib/utils/logger';

const client = createClient({
	fetch,
	fetchOptions: {
		headers: {
			'Content-Type': 'application/json',
			'x-hasura-admin-secret': getHasuraAdminSecret(),
		},
	},
	requestPolicy: 'network-only',
	url: getGraphqlAPI(),
});

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
export type InscriptionRequest = yup.InferType<typeof inscriptionRequestSchema>;

const validateBody = (body: unknown): body is InscriptionRequest => {
	return inscriptionRequestSchema.isType(body);
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (!validateBody(body)) {
		throw error(400, 'inscription: invalid body');
	}

	const { accountRequest, structureId, requester, autoConfirm } = body;

	const { email, firstname, lastname, mobileNumber, position } = accountRequest;
	let [username] = email.split('@');

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
		logger.error(emailResult);
		throw error(500, 'inscription: server error');
	}

	if (emailResult.data.account.length > 0) {
		logger.error(`l'email ${email} est déjà utilisé`);
		throw error(400, 'inscription: email already used');
	}

	const { error: err, data } = await client
		.query<GetAccountByUsernameQuery>(GetAccountByUsernameDocument, {
			comp: { _ilike: `${username.toLowerCase()}%` },
		})
		.toPromise();

	if (err || !data) {
		logger.error(err);
		throw error(500, 'inscription: get account failed');
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
				type: RoleEnum.Professional,
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
		logger.error(error);
		throw error(500, 'inscription: insert failed');
	}

	const { account } = insertResult.data;

	if (autoConfirm) {
		const result = await updateAccessKey(client, account.id);
		if (result.error) {
			logger.error(result.error, 'login');
			throw error(500, 'server error');
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
			logger.error(emailError);
		});
	} else {
		// send email to all deployment managers for the target structure
		const { error: err, data } = await client
			.query<GetDeploymentManagersForStructureQuery>(GetDeploymentManagersForStructureDocument, {
				structureId,
			})
			.toPromise();
		if (err) {
			// instead of erroring for the end-user (in spite of the accounts having been created in actuality),
			// we should return a success and send an admin-level error to handle notifying the managers
			throw error(500, 'server error');
		}

		const emails: string[] = data?.structure?.deployment?.managers?.map(({ email }) => email);
		sendEmailNotifications(emails, accountRequest, account.professional.structure.name, requester);
	}

	return json({ accountId: account.id });
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
	structureName: string,
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
					pro: accountRequest,
					structureName,
					url: {
						appUrl,
					},
					requester,
				},
			],
		}).catch((emailError) => {
			logger.error(emailError);
		});
	}
}
