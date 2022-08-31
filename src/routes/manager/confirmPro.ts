import type { RequestHandler } from '@sveltejs/kit';
import send from '$lib/emailing';
import { getGraphqlAPI, getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import { createClient } from '@urql/core';
import {
	ConfirmAccountByIdDocument,
	GetAccountByIdDocument,
	RoleEnum,
} from '$lib/graphql/_gen/typed-document-nodes';
import type {
	ConfirmAccountByIdMutation,
	GetAccountByIdQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import { authorizeOnly } from '$lib/utils/security';
import { v4 as uuidv4 } from 'uuid';
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

const confirmProSchema = yup.object().shape({
	id: yup.string().uuid().required(),
});
type ConfirmPro = yup.InferType<typeof confirmProSchema>;

const validateBody = (body: unknown): body is ConfirmPro => {
	return confirmProSchema.isType(body);
};

export const post: RequestHandler = async ({ request }) => {
	try {
		authorizeOnly(['manager'])(request);
	} catch (e) {
		return {
			status: 403,
		};
	}

	const body = await request.json();

	if (!validateBody(body)) {
		return {
			status: 400,
			body: {
				errors: 'INVALID_BODY',
			},
		};
	}

	const { id } = body;

	const appUrl = getAppUrl();

	const { error, data } = await client
		.query<GetAccountByIdQuery>(GetAccountByIdDocument, { id })
		.toPromise();

	if (error) {
		console.error('confirmPro', error);
		return {
			status: 500,
			body: {
				errors: 'SERVER_ERROR',
			},
		};
	}

	if (!data.account) {
		return {
			status: 404,
			body: {
				errors: 'Account not found',
			},
		};
	}

	if (!accountHasRelation(data.account)) {
		return {
			status: 400,
			body: {
				errors: 'confirmpro: Invalid account type',
			},
		};
	}

	const { email, lastname, firstname } =
		data.account.professional || data.account.orientation_manager;

	const result = await client
		.mutation<ConfirmAccountByIdMutation>(ConfirmAccountByIdDocument, {
			id,
			accessKey: uuidv4(),
			accessKeyDate: new Date().toISOString(),
		})
		.toPromise();

	if (result.error) {
		console.error('Could not confirm pro', { id, email, firstname, lastname, error: result.error });
		return {
			status: 500,
			body: {
				errors: 'SERVER_ERROR',
			},
		};
	}

	const accessKey = result.data.account.accessKey;

	// send email
	send({
		options: {
			to: email,
			subject: "Votre demande d'inscription à Carnet de Bord est validée",
		},
		template: 'accountRequestValidate',
		params: [
			{
				pro: {
					firstname,
					lastname,
				},
				url: {
					accessKey,
					appUrl,
				},
			},
		],
	}).catch((emailError) => {
		console.error(emailError);
	});

	return {
		status: 200,
		body: {},
	};
};

export function accountHasRelation(account: GetAccountByIdQuery['account']) {
	return (
		(account.type === RoleEnum.Professional && account.professional) ||
		(account.type === RoleEnum.OrientationManager && account.orientation_manager)
	);
}
