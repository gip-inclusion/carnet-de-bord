import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import send from '$lib/emailing';
import { getGraphqlAPI, getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import { createClient } from '@urql/core';
import { GetAccountByIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
import type { GetAccountByIdQuery } from '$lib/graphql/_gen/typed-document-nodes';
import { updateAccessKey } from '$lib/services/account';
import { authorizeOnly } from '$lib/utils/security';
import * as yup from 'yup';
import { accountHasRelation } from '../confirmPro/+server';

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

const sendConnectionEmailSchema = yup.object().shape({
	id: yup.string().uuid().required(),
});
type SendConnectionEmail = yup.InferType<typeof sendConnectionEmailSchema>;

const validateBody = (body: unknown): body is SendConnectionEmail => {
	return sendConnectionEmailSchema.isType(body);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		authorizeOnly(['manager'])(request);
	} catch (e) {
		throw error(403, 'sendConnectionEmail: unauthorized');
	}

	const body = await request.json();

	if (!validateBody(body)) {
		throw error(400, 'sendConnectionEmail: invalid body');
	}

	const { id } = body;

	const appUrl = getAppUrl();

	const { error: err, data } = await client
		.query<GetAccountByIdQuery>(GetAccountByIdDocument, { id })
		.toPromise();

	if (err) {
		console.error('sendConnectionEmail', err);
		throw error(500, 'sendConnectionEmail: server error');
	}

	if (!data.account) {
		throw error(500, 'sendConnectionEmail: account not found');
	}

	if (!accountHasRelation(data.account)) {
		throw error(500, 'sendConnectionEmail: Invalid account type');
	}

	const { email, lastname, firstname } =
		data.account.professional || data.account.orientation_manager;

	if (!data.account.confirmed) {
		console.error('Did not send email to unconfirmed account', {
			email,
			lastname,
			firstname,
		});
		throw error(500, 'sendConnectionEmail: unconfirmed account');
	}

	const result = await updateAccessKey(client, id);
	if (result.error) {
		console.error('Could not update access key', { error: result.error });
		throw error(500, 'sendConnectionEmail: cannot update access key');
	}
	const accessKey = result.data.account.accessKey;
	const username = data.account.username;

	// send email
	send({
		options: {
			to: email,
			subject: 'Accédez à votre espace Carnet de bord',
		},
		template: 'forgotLoginRequest',
		params: [
			{
				account: {
					firstname,
					lastname,
					username,
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

	return json({});
};
