import { error, json } from '@sveltejs/kit';
import { getAppUrl, getGraphqlAPI, getHasuraAdminSecret } from '$lib/config/variables/private';
import { env } from '$env/dynamic/public';

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
import { logger } from '$lib/utils/logger';

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
export const POST: RequestHandler = async ({ request }) => {
	try {
		actionsGuard(request.headers);
	} catch (e) {
		logAndThrow(e, 401, 'matomo_dashboard: unauthorized action');
	}

	const deploymentResult = await client.query(ListDeploymentIdDocument).toPromise();

	if (deploymentResult.error) {
		logAndThrow(deploymentResult.error, 500, 'matomo_dashboard: error retrieving deployment');
	}
	const day = formatDateISO(new Date());
	const last30Days = formatDateISO(subDays(new Date(), 30));
	for (const { id } of deploymentResult.data.deployments) {
		const statResult = await client
			.query(GetDeploymentStatForDayDocument, { deploymentId: id, day, last30Days })
			.toPromise();
		if (statResult.error) {
			logAndThrow(
				statResult.error,
				500,
				'matomo_dashboard: Error retrieving deployment ${id} stats'
			);
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

		const Matomo = new MatomoTracker(
			env.PUBLIC_MATOMO_SITE_ID,
			`${env.PUBLIC_MATOMO_URL}/matomo.php`
		);
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
			logger.debug({
				event: 'Matomo dashboard: information sent',
				e_c: 'dashboard',
				e_a: 'stats',
				e_n: label,
				e_v: value,
				[`dimension${CustomDimensions.Deployment}`]: id,
				[`dimension${CustomDimensions.Role}`]: 'export bot',
			});
		}
	}
	return json({
		message: 'stats sent successfully',
	});
};

function logAndThrow(e: Error, status: number, message: string) {
	logger.error({
		status,
		message,
		err: {
			message: e.message,
			stack: e.stack,
		},
	});
	throw error(status, message);
}
