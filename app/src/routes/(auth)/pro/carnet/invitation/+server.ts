import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getAppUrl, getGraphqlAPI, getHasuraAdminSecret } from '$lib/config/variables/private';
import { createClient } from '@urql/core';
import { GetNotebookMemberByIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
import type { GetNotebookMemberByIdQuery } from '$lib/graphql/_gen/typed-document-nodes';
import { updateAccessKey } from '$lib/services/account';
import send from '$lib/emailing';
import * as yup from 'yup';
import { authorizeOnly } from '$lib/utils/security';
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

const carnetInvitationSchema = yup.object().shape({
	notebookMemberId: yup.string().uuid().required(),
});
type CarnetInvitation = yup.InferType<typeof carnetInvitationSchema>;

const validateBody = (body: unknown): body is CarnetInvitation => {
	return carnetInvitationSchema.isType(body);
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	try {
		authorizeOnly(['professional'])(request);
	} catch (e) {
		throw error(403, 'invitation: unauthorized');
	}

	if (!validateBody(body)) {
		throw error(400, 'invitation: invalid body');
	}

	const { notebookMemberId } = body;

	const { data, error: err } = await client
		.query<GetNotebookMemberByIdQuery>(GetNotebookMemberByIdDocument, { id: notebookMemberId })
		.toPromise();

	if (err || !data) {
		throw error(401, 'invitation: notebook member not found');
	}
	const { notebookId, creator, account } = data.member;
	/**
	 * If professional account is not confirmed, we don't send invitation
	 */
	if (!account?.confirmed) {
		return json({});
	}
	const result = await updateAccessKey(client, account.id);
	if (result.error) {
		throw error(500, "invitation: can't update access key");
	}
	const accessKey = result.data?.account?.accessKey;
	const appUrl = getAppUrl();

	// send email
	send({
		options: {
			to: account.professional.email,
			subject: 'Invitation à rejoindre un carnet de bord',
		},
		template: 'NotebookInvitation',
		params: [
			{
				pro: account.professional,
				creator: creator.professional || creator.orientation_manager,
				url: { accessKey, appUrl, redirectUrl: `/carnet/${notebookId}` },
			},
		],
	}).catch((emailError) => {
		logger.error(emailError);
	});

	return json({
		email: account.professional.email,
	});
};
