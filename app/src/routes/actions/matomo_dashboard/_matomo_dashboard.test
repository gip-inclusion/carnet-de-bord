import { POST } from './+server';
import Matomo from 'matomo-tracker';
import mockRequest from '$lib/tests/mockRequest';

jest.mock('matomo-tracker');

Matomo.track = jest.fn();

global.fetch = jest.fn().mockImplementation((_, params) =>
	Promise.resolve({
		ok: true,
		json: () => {
			if (params.body.match(/ListDeploymentId/)) {
				return Promise.resolve({
					data: {
						deployments: [
							{
								id: 'deployment-uuid',
							},
						],
					},
				});
			}
			if (params.body.match(/GetDeploymentStatForDay/)) {
				return Promise.resolve({
					data: {
						nbNotebooks: { aggregate: { count: 10 } },
						nbProfessionals: { aggregate: { count: 20 } },
						nbStructures: { aggregate: { count: 30 } },
						nbNotebookWithActions: { aggregate: { count: 40 } },
						nbNotebookModifiedSince30d: { aggregate: { count: 9 } },
						nbNotebookCreatedToday: { aggregate: { count: 1 } },
						nbNotebookModifiedToday: { aggregate: { count: 2 } },
						nbNotebookVisitedToday: { aggregate: { count: 3 } },
						nbNotebookWithActionsCreated: { aggregate: { count: 4 } },
						nbNotbookWith2MembersOrMore: { aggregate: { count: 5 } },
					},
				});
			}
		},
	})
);

describe('matomo_dashboard', () => {
	test('should return 401 if action does not have secret token', async () => {
		const response = await mockRequest(POST, {});
		expect(response).toEqual({
			status: 401,
			body: '[STAT action] ACTION_SECRET header not match',
		});
	});
	test('should return 200', async () => {
		const response = await mockRequest(POST, {}, { secret_token: process.env.ACTION_SECRET });
		expect(response).toEqual({
			status: 200,
			body: { message: 'stats sent successfully' },
		});
	});
});
