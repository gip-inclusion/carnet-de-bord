import { getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import { getGraphqlAPI } from '$lib/config/variables/public';
import {
	BeneficiarySetInput,
	GetNotebookInfoDocument,
	GetNotebookInfoQuery,
	NotebookFocusInsertInput,
	NotebookSetInput,
	UpdateNotebookFromApiDocument,
	DeploymentConfigInput,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { BeneficiaryAccount } from '$lib/types';
import { actionsGuard } from '$lib/utils/security';
import type { RequestHandler } from '@sveltejs/kit';
import { createClient } from '@urql/core';

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

export type ExternalDeploymentApiOutput = {
	notebook: NotebookSetInput;
	beneficiary: BeneficiarySetInput;
	focuses: NotebookFocusInsertInput[];
};

export type ExternalDeploymentApiBody = {
	url: string;
	headers: Record<string, string>;
	input: Pick<BeneficiaryAccount, 'firstname' | 'lastname' | 'dateOfBirth'>;
	professionalId: string;
	notebookId: string;
};

type Body = {
	input: {
		id: string;
		config: DeploymentConfigInput;
	};
};

export const post: RequestHandler<unknown, Body> = async (request) => {
	const { input } = request.body;
	try {
		actionsGuard(request.headers);
	} catch (error) {
		return {
			status: 401,
			body: error.message,
		};
	}

	const { error, data } = await client
		.query<GetNotebookInfoQuery>(GetNotebookInfoDocument, { id: input.id })
		.toPromise();

	if (error || !data.notebook) {
		console.error('update_notebook', `notebook ${input.id} not found`);
		return {
			status: 401,
			body: {
				errors: 'DEPLOYMENT_NOT_FOUND',
			},
		};
	}

	const { url, callback, headers } = input.config;
	const { beneficiary, members } = data.notebook;
	console.log({ url, callback, headers, beneficiary, members });
	const callbackUrl = `${getAppUrl()}${callback}`;
	const result: ExternalDeploymentApiOutput = await fetch(callbackUrl, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			url,
			headers,
			input: beneficiary,
			notebookId: input.id,
			professionalId: members[0]?.professionalId,
		}),
	}).then((response) => {
		if (response.ok) {
			return response.json();
		}
		Promise.reject(response.json());
	});

	await client
		.mutation(UpdateNotebookFromApiDocument, {
			notebookId: input.id,
			notebook: result.notebook,
			beneficiaryId: beneficiary.id,
			beneficiary: result.beneficiary,
			focuses: result.focuses,
		})
		.toPromise();

	return {
		status: 200,
		body: { id: '6b7cd0c7-6340-401b-a809-869e4f640eb7' },
	};
};
