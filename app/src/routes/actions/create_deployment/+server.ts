import { json, error } from '@sveltejs/kit';
import { getGraphqlAPI, getAppUrl } from '$lib/config/variables/private';
import send from '$lib/emailing';
import { CreateDeploymentFromApiDocument } from '$lib/graphql/_gen/typed-document-nodes';
import { updateAccessKey } from '$lib/services/account';
import { actionsGuard } from '$lib/utils/security';
import type { RequestHandler } from '@sveltejs/kit';
import { createClient } from '@urql/core';
import { logger } from '$lib/utils/logger';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	try {
		actionsGuard(request.headers);
	} catch (error) {
		logger.error(
			{ error, headers: request.headers, body },
			'Rejected access to actions/create_deployment because request lacked proper headers'
		);
		throw error(500, 'create_deployment: unauthorize action');
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
		logger.error(
			{
				error: updateResult.error,
				email,
				deployment,
			},
			'Error inserting new deployment and manager'
		);
		throw error(500, 'create deployment failed');
	}

	const id = updateResult.data?.insert_deployment_one?.managers[0]?.account?.id;

	if (!id) {
		logger.error({ email, deployment }, 'Could not get id of newly created manager');
		throw error(500, 'create_deployment: missing id');
	}

	const result = await updateAccessKey(client, id);
	if (result.error) {
		logger.error(
			{ error: result.error, email, deployment },
			'Error updating access key for magic link'
		);
		throw error(500, 'update access key failed');
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
		logger.error({ error: emailError, email, deployment }, 'Could not send email');
	});

	return json({
		id: updateResult.data?.insert_deployment_one?.id,
		label: updateResult.data?.insert_deployment_one?.label,
	});
};
