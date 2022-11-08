import { json, error } from '@sveltejs/kit';
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
import { logger } from '$lib/utils/logger';
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

export const POST: RequestHandler = async ({ request }) => {
	try {
		authorizeOnly(['manager'])(request);
	} catch (e) {
		throw error(403, 'confirmPro: unauthorized');
	}

	const body = await request.json();

	if (!validateBody(body)) {
		throw error(500, 'confirmPro: invalid body');
	}

	const { id } = body;

	const appUrl = getAppUrl();

	const { error: err, data } = await client
		.query<GetAccountByIdQuery>(GetAccountByIdDocument, { id })
		.toPromise();

	if (err) {
		logger.error(err, 'confirmPro');
		throw error(500, 'confirmPro: server error');
	}

	if (!data.account) {
		throw error(403, 'confirmPro: account not found');
	}

	if (!accountHasRelation(data.account)) {
		throw error(403, 'confirmPro: invalid account type');
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
		logger.error({
			message: 'Could not confirm pro',
			id,
			email,
			firstname,
			lastname,
			error: result.error,
		});
		throw error(403, 'confirmPro: server error');
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
		logger.error(emailError);
	});

	return json({});
};

export function accountHasRelation(account: GetAccountByIdQuery['account']) {
	return (
		(account.type === RoleEnum.Professional && account.professional) ||
		(account.type === RoleEnum.OrientationManager && account.orientation_manager)
	);
}
