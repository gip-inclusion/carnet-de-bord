import type { RequestHandler } from '@sveltejs/kit';
import { getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import { createClient } from '@urql/core';
import { getGraphqlAPI } from '$lib/config/variables/public';
import {
	GetNotebookMemberByIdDocument,
	GetNotebookMemberByIdQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import { updateAccessKey } from '$lib/services/account';
import send from '$lib/emailing';

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

export const post: RequestHandler = async (request) => {
	const { notebookMemberId } = request.body as unknown as {
		notebookMemberId: string;
	};

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
	const { notebookId, creator, professional } = data.member;

	/**
	 * If professional account is not confirmed, we don't send invitation
	 */
	if (!professional?.account?.confirmed) {
		return {
			status: 200,
			body: {},
		};
	}
	const result = await updateAccessKey(client, professional.account.id);
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
	try {
		await send({
			options: {
				to: professional.email,
				subject: 'Invitation à rejoindre un carnet de bord',
			},
			template: 'notebookInvitation',
			params: [
				{
					pro: professional,
					creator,
					url: { accessKey, appUrl, redirectUrl: `/pro/carnet/${notebookId}` },
				},
			],
		});
	} catch (e) {
		console.log(e);
	}

	return {
		status: 200,
		body: {
			email: professional.email,
		},
	};
};
