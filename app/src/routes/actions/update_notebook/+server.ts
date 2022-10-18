import { json, error } from '@sveltejs/kit';
import { getGraphqlAPI, getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import {
	GetNotebookInfoDocument,
	UpdateNotebookFromApiDocument,
} from '$lib/graphql/_gen/typed-document-nodes';
import type {
	BeneficiarySetInput,
	GetNotebookInfoQuery,
	NotebookFocus,
	NotebookActionInsertInput,
	NotebookFocusInsertInput,
	NotebookSetInput,
	NotebookTargetInsertInput,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { BeneficiaryAccount, DeploymentConfig } from '$lib/types';
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
	targets: NotebookTargetInsertInput[];
	actions: NotebookActionInsertInput[];
};

export type ExternalDeploymentApiBody = {
	url: string;
	headers: Record<string, string>;
	input: Pick<BeneficiaryAccount, 'firstname' | 'lastname' | 'dateOfBirth'>;
	accountId: string;
	notebookId: string;
	focuses: NotebookFocus[];
};

type Body = {
	input: {
		id: string;
	};
};

export const POST: RequestHandler = async ({ request }) => {
	const { input } = (await request.json()) as Body;
	try {
		actionsGuard(request.headers);
	} catch (err) {
		throw error(500, 'update_notebook: unauthorize action');
	}

	const { error: err, data } = await client
		.query<GetNotebookInfoQuery>(GetNotebookInfoDocument, { id: input.id })
		.toPromise();

	if (err || !data.notebook) {
		console.error('update_notebook', `notebook ${input.id} not found`);
		throw error(500, 'update_notebook: notebook not found');
	}

	// TODO(Augustin): actually check that we get a DeploymentConfig instead
	const { url, callback, headers } = data.notebook.beneficiary.deployment
		.config as DeploymentConfig;
	const { beneficiary, members, focuses } = data.notebook;
	const callbackUrl = `${getAppUrl()}${callback}`;
	let result: ExternalDeploymentApiOutput;
	try {
		result = await fetch(callbackUrl, {
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
				accountId: members[0]?.accountId,
				focuses,
			}),
		}).then(async (response) => {
			if (response.ok) {
				console.log(`carnet ${input.id} mis à jour !`);
				return response.json();
			}
			const errorMessage = await response.text();
			return Promise.reject(new Error(errorMessage));
		});
	} catch (err) {
		console.error(`echec de mise à jour du carnet ${input.id}`, err, url, callback);
		throw error(500, 'update_notebook: callback failed');
	}

	const updateResult = await client
		.mutation(UpdateNotebookFromApiDocument, {
			notebookId: input.id,
			notebook: result.notebook,
			beneficiaryId: beneficiary.id,
			beneficiary: result.beneficiary,
			focuses: result.focuses,
			targets: result.targets,
			actions: result.actions,
		})
		.toPromise();
	if (updateResult.error) {
		console.error(updateResult.error);
		throw error(500, 'update_notebook: update failed');
	}
	return json({ id: input.id });
};
