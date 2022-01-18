import { getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import { getGraphqlAPI } from '$lib/config/variables/public';
import send from '$lib/emailing';
import {
	GetAccountByEmailDocument,
	GetAccountByUsernameDocument,
	GetDeploymentManagersForStructureDocument,
	InsertProfessionalAccountDocument,
} from '$lib/graphql/_gen/typed-document-nodes';
import type {
	GetAccountByEmailQuery,
	GetAccountByUsernameQuery,
	GetDeploymentManagersForStructureQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { RequestHandler } from '@sveltejs/kit';
import { updateAccessKey } from '$lib/services/account';
import { createClient } from '@urql/core';
import * as yup from 'yup';

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
type InscriptionRequest = yup.InferType<typeof inscriptionRequestSchema>;

const validateBody = (body: unknown): body is InscriptionRequest => {
	return inscriptionRequestSchema.isType(body);
};

export const post: RequestHandler<Record<string, unknown>, Record<string, unknown>> = async (
	request
) => {
	const body = request.body;
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
		const matcher = new RegExp(`^${username}(\\d*)$`);
		const index = data.account.reduce((maxIndex, item) => {
			const matched = item.username.match(matcher);
			if (!matched) {
				return maxIndex;
			}
			if (isNaN(parseInt(matched[1]))) {
				return maxIndex;
			}
			return Math.max(parseInt(matched[1]), maxIndex);
		}, 0);
		username += `${index + 1}`;
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
	const appUrl = getAppUrl();

	if (autoConfirm) {
		const result = await updateAccessKey(client, account.id, true);
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
		try {
			await send({
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
							appUrl,
						},
					},
				],
			});
		} catch (e) {
			console.log(e);
		}
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
		for (const email of emails) {
			try {
				await send({
					options: {
						to: email,
						subject: 'Demande de création de compte',
					},
					template: 'accountRequest',
					params: [
						{
							pro: {
								firstname,
								lastname,
							},
							url: {
								appUrl,
							},
							requester,
						},
					],
				});
			} catch (e) {
				console.log(e);
			}
		}
	}

	return {
		status: 200,
		body: { professionalId: account.professional.id },
	};
};
