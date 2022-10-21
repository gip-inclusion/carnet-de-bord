import type { RequestHandler } from '@sveltejs/kit';
import { getGraphqlAPI, getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import { createClient } from '@urql/core';
import { GetNotebookMemberByIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
import type { GetNotebookMemberByIdQuery } from '$lib/graphql/_gen/typed-document-nodes';
import { updateAccessKey } from '$lib/services/account';
import send from '$lib/emailing';
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

const carnetInvitationSchema = yup.object().shape({
	notebookMemberId: yup.string().uuid().required(),
});
type CarnetInvitation = yup.InferType<typeof carnetInvitationSchema>;

const validateBody = (body: unknown): body is CarnetInvitation => {
	return carnetInvitationSchema.isType(body);
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

	const { notebookMemberId } = body;

	const { data, error } = await client
		.query<GetNotebookMemberByIdQuery>(GetNotebookMemberByIdDocument, { id: notebookMemberId })
		.toPromise();

	if (error || !data) {
		return {
			status: 401,
			body: {
				errors: 'NOTEBOOK_MEMBER_NOT_FOUND',
			},
		};
	}
	const { notebookId, creator, account } = data.member;
	/**
	 * If professional account is not confirmed, we don't send invitation
	 */
	if (!account?.confirmed) {
		return {
			status: 200,
			body: {},
		};
	}
	const result = await updateAccessKey(client, account.id);
	if (result.error) {
		return {
			status: 500,
			body: {
				errors: 'SERVER_ERROR',
			},
		};
	}
	const accessKey = result.data?.account?.accessKey;
	const appUrl = getAppUrl();

	// send email
	send({
		options: {
			to: account.professional.email,
			subject: 'Invitation à rejoindre un carnet de bord',
		},
		template: 'notebookInvitation',
		params: [
			{
				pro: account.professional,
				creator: creator.professional || creator.orientation_manager,
				url: { accessKey, appUrl, redirectUrl: `/pro/carnet/${notebookId}` },
			},
		],
	}).catch((emailError) => {
		console.error(emailError);
	});

	return {
		status: 200,
		body: {
			email: account.professional.email,
		},
	};
};
