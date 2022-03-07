import { getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import { getGraphqlAPI, getMatomoSiteId, getMatomoUrl } from '$lib/config/variables/public';
import {
	GetDeploymentStatForDayDocument,
	ListDeploymentIdDocument,
} from '$lib/graphql/_gen/typed-document-nodes';
import { CustomDimensions } from '$lib/tracking/matomo';
import { formatDateISO } from '$lib/utils/date';
import { actionsGuard } from '$lib/utils/security';
import type { RequestHandler } from '@sveltejs/kit';
import { createClient } from '@urql/core';
import MatomoTracker from 'matomo-tracker';

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

const Matomo = new MatomoTracker(getMatomoSiteId(), `${getMatomoUrl()}/matomo.php`);

/**
 * Endpoint that will be triggerd by an Hasura Scheduled Event
 * @see https://hasura.io/docs/latest/graphql/core/scheduled-triggers/create-cron-trigger.html
 * This will send dashboard data as a matomo event on daily basis
 * Stats are
 * - number of created notebook for the day
 * - number of visited notebook for the day
 * - number of updated notebook for the day
 * - number of notebook with new focus / target / action for the day
 * - number of notebook with 2 members of more
 */
export const post: RequestHandler = async (request) => {
	try {
		actionsGuard(request.headers);
	} catch (error) {
		return {
			status: 401,
			body: error.message,
		};
	}

	const deploymentResult = await client.query(ListDeploymentIdDocument).toPromise();

	if (deploymentResult.error) {
		console.error(deploymentResult.error);
		return {
			status: 400,
			body: {
				message: 'Error retrieving deployment',
			},
		};
	}
	for (const { id } of deploymentResult.data.deployments) {
		const statResult = await client
			.query(GetDeploymentStatForDayDocument, { deploymentId: id, day: formatDateISO(new Date()) })
			.toPromise();
		if (statResult.error) {
			console.error(statResult.error);
			return {
				status: 400,
				body: {
					message: `Error retrieving deployment ${id} stats`,
				},
			};
		}

		const { created, lastModified, lastVisited, withActions, withMembers } = statResult.data;
		const stats = [
			{
				label: 'created',
				value: created.aggregate.count,
			},
			{
				label: 'lastVisited',
				value: lastVisited.aggregate.count,
			},
			{
				label: 'lastModified',
				value: lastModified.aggregate.count,
			},
			{
				label: 'withActions',
				value: withActions.aggregate.count,
			},
			{
				label: 'withMembers',
				value: withMembers.aggregate.count,
			},
		];
		for (const { label, value } of stats) {
			Matomo.track({
				url: `${getAppUrl()}/export_metadata`,
				action_name: 'export dashboard data',
				ua: 'Node.js',
				ca: 1,
				e_c: 'dashboard',
				e_a: 'stats',
				e_n: label,
				e_v: value,
				[`dimension${CustomDimensions.Deployment}`]: id,
				[`dimension${CustomDimensions.Role}`]: 'export bot',
			});
			console.log('send ', {
				e_c: 'dashboard',
				e_a: 'stats',
				e_n: label,
				e_v: value,
				[`dimension${CustomDimensions.Deployment}`]: id,
				[`dimension${CustomDimensions.Role}`]: 'export bot',
			});
		}
	}
	return {
		status: 200,
		body: {
			message: 'stats sent successfully',
		},
	};
};
