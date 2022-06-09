import { getGraphqlAPI, getAppUrl } from '$lib/config/variables/private';
import send from '$lib/emailing';
import { CreateDeploymentFromApiDocument } from '$lib/graphql/_gen/typed-document-nodes';
import { updateAccessKey } from '$lib/services/account';
import { actionError } from '$lib/utils/actions';
import { actionsGuard } from '$lib/utils/security';
import type { RequestHandler } from '@sveltejs/kit';
import { createClient } from '@urql/core';

export const post: RequestHandler = async ({ request }) => {
	const body = await request.json();
	try {
		actionsGuard(request.headers);
	} catch (error) {
		console.error(
			'Rejected access to actions/create_deployment because request lacked proper headers',
			{ headers: request.headers, body },
			error
		);
		return actionError(error.message, 401);
	}

	const client = createClient({
		fetch,
		fetchOptions: {
			headers: {
				'Content-Type': 'application/json',
				authorization: request.headers.get('authorization'),
			},
		},
		requestPolicy: 'network-only',
		url: getGraphqlAPI(),
	});

	const {
		input: { deployment, email },
	} = body;

	const updateResult = await client
		.mutation(CreateDeploymentFromApiDocument, {
			object: {
				label: deployment,
				managers: {
					data: [
						{
							email,
							account: {
								data: {},
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
		return actionError(updateResult.error.message, 400);
	}

	const id = updateResult.data?.insert_deployment_one?.managers[0]?.account?.id;

	if (!id) {
		console.error('Could not get id of newly created manager', { email, deployment });
		return actionError(`[createDeployement] update failed`, 400);
	}

	const result = await updateAccessKey(client, id);
	if (result.error) {
		console.error('Error updating access key for magic link', {
			error: result.error,
			email,
			deployment,
		});
		return actionError(`[createDeployement] Error updating access key for magic link`, 400);
	}

	const accessKey = result.data.account.accessKey;
	const appUrl = getAppUrl();

	// send email
	send({
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
	}).catch((emailError) => {
		console.error('Could not send email', { error: emailError, email, deployment });
	});

	return {
		status: 200,
		body: {
			id: updateResult.data?.insert_deployment_one?.id,
			label: updateResult.data?.insert_deployment_one?.label,
		},
	};
};
