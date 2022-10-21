import { getGraphqlAPI, getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import { getMatomoSiteId, getMatomoUrl } from '$lib/config/variables/public';
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
import { subDays } from 'date-fns';

const client = createClient({
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
export const post: RequestHandler = async ({ request }) => {
	try {
		actionsGuard(request.headers);
	} catch (error) {
		return {
			status: 401,
			body: `[STAT action] ${error.message}`,
		};
	}

	const deploymentResult = await client.query(ListDeploymentIdDocument).toPromise();

	if (deploymentResult.error) {
		console.error(deploymentResult.error);
		return {
			status: 400,
			body: {
				message: '[STATS action] Error retrieving deployment',
			},
		};
	}
	const day = formatDateISO(new Date());
	const last30Days = formatDateISO(subDays(new Date(), 30));
	for (const { id } of deploymentResult.data.deployments) {
		const statResult = await client
			.query(GetDeploymentStatForDayDocument, { deploymentId: id, day, last30Days })
			.toPromise();
		if (statResult.error) {
			console.error(statResult.error);
			return {
				status: 400,
				body: {
					message: `[STATS action] Error retrieving deployment ${id} stats`,
				},
			};
		}

		const {
			nbNotebooks,
			nbProfessionals,
			nbStructures,
			nbNotebookWithActions,
			nbNotebookModifiedSince30d,
			nbNotebookCreatedToday,
			nbNotebookModifiedToday,
			nbNotebookVisitedToday,
			nbNotebookWithActionsCreated,
			nbNotbookWith2MembersOrMore,
		} = statResult.data;
		const stats = [
			{
				label: 'nbNotebookCreatedToday',
				value: nbNotebookCreatedToday.aggregate.count,
			},
			{
				label: 'nbNotebookVisitedToday',
				value: nbNotebookVisitedToday.aggregate.count,
			},
			{
				label: 'nbNotebookModifiedToday',
				value: nbNotebookModifiedToday.aggregate.count,
			},
			{
				label: 'nbNotebookWithActionsCreated',
				value: nbNotebookWithActionsCreated.aggregate.count,
			},
			{
				label: 'nbNotbookWith2MembersOrMore',
				value: nbNotbookWith2MembersOrMore.aggregate.count,
			},
			{
				label: 'nbNotebooks',
				value: nbNotebooks.aggregate.count,
			},
			{
				label: 'nbProfessionals',
				value: nbProfessionals.aggregate.count,
			},
			{
				label: 'nbStructures',
				value: nbStructures.aggregate.count,
			},
			{
				label: 'nbNotebookWithActions',
				value: nbNotebookWithActions.aggregate.count,
			},
			{
				label: 'nbNotebookModifiedSince30d',
				value: nbNotebookModifiedSince30d.aggregate.count,
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
