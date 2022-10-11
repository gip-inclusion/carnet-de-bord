import { json as json$1 } from '@sveltejs/kit';
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

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (!validateBody(body)) {
		return json$1(
			{
				errors: 'INVALID_BODY',
			},
			{
				status: 400,
			}
		);
	}

	const { notebookMemberId } = body;

	const { data, error } = await client
		.query<GetNotebookMemberByIdQuery>(GetNotebookMemberByIdDocument, { id: notebookMemberId })
		.toPromise();

	if (error || !data) {
		return json$1(
			{
				errors: 'NOTEBOOK_MEMBER_NOT_FOUND',
			},
			{
				status: 401,
			}
		);
	}
	const { notebookId, creator, account } = data.member;
	/**
	 * If professional account is not confirmed, we don't send invitation
	 */
	if (!account?.confirmed) {
		return json$1({});
	}
	const result = await updateAccessKey(client, account.id);
	if (result.error) {
		return json$1(
			{
				errors: 'SERVER_ERROR',
			},
			{
				status: 500,
			}
		);
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

	return json$1({
		email: account.professional.email,
	});
};
