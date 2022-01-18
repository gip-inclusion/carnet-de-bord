import { getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import { getGraphqlAPI } from '$lib/config/variables/public';
import send from '$lib/emailing';
import { CreateDeploymentFromApiDocument } from '$lib/graphql/_gen/typed-document-nodes';
import { updateAccessKey } from '$lib/services/account';
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

type Body = {
	input: {
		email: string;
		deployment: string;
	};
};

export const post: RequestHandler<unknown, Body> = async (request) => {
	try {
		actionsGuard(request.headers);
	} catch (error) {
		console.error(
			'Rejected access to actions/create_deployment because request lacked proper headers',
			{ headers: request.headers, body: request.body }
		);
		return {
			status: 401,
			body: error.message,
		};
	}

	const {
		input: { deployment, email },
	} = request.body;

	const updateResult = await client
		.mutation(CreateDeploymentFromApiDocument, {
			object: {
				label: deployment,
				managers: {
					data: [
						{
							email,
							account: {
								data: {
									type: 'manager',
								},
							},
						},
					],
				},
			},
		})
		.toPromise();
	if (updateResult.error) {
		console.error('Error inserting new deployment and manager', {
			error: updateResult.error,
			email,
			deployment,
		});
		return {
			status: 500,
			body: { error: 'UPDATE_FAILED' },
		};
	}

	const id = updateResult.data?.insert_deployment_one?.managers[0]?.account?.id;

	if (!id) {
		console.error('Could not get id of newly created manager', { email, deployment });
		return {
			status: 500,
			body: { error: 'UPDATE_FAILED' },
		};
	}

	const result = await updateAccessKey(client, id);
	if (result.error) {
		console.error('Error updating access key for magic link', {
			error: result.error,
			email,
			deployment,
		});
		return {
			status: 500,
			body: {
				errors: 'SERVER_ERROR',
			},
		};
	}

	const accessKey = result.data.account.accessKey;
	const appUrl = getAppUrl();

	// send email
	try {
		await send({
			options: {
				to: email,
				subject: 'Bienvenue sur Carnet de bord',
			},
			template: 'managerOnboarding',
			params: [
				{
					url: {
						accessKey,
						appUrl,
					},
					deployment,
				},
			],
		});
	} catch (e) {
		console.error('Could not send email', { error: e, email, deployment });
		return {
			status: 500,
			body: {
				errors: 'SERVER_ERROR',
			},
		};
	}

	return {
		status: 200,
		body: {
			id: updateResult.data?.insert_deployment_one?.id,
			label: updateResult.data?.insert_deployment_one?.label,
		},
	};
};
