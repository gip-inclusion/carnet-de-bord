import { POST } from './+server';
import Matomo from 'matomo-tracker';
import { request } from 'svelte-kit-test-helpers';
vi.mock('matomo-tracker');

vi.mock('@urql/core', () => {
	return {
		createClient: () => ({
			query: (params) => {
				const operation = params.definitions[0].name.value;
				let data = {};
				if (operation === 'ListDeploymentId') {
					data = {
						deployments: [
							{
								id: 'deployment-uuid',
							},
						],
					};
				}

				if (operation === 'GetDeploymentStatForDay') {
					data = {
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
					};
				}

				return {
					toPromise: async () => ({ data }),
				};
			},
		}),
	};
});

Matomo.track = vi.fn();

describe('matomo_dashboard', () => {
	test('should return 401 if action does not have secret token', async () => {
		const response = await request(POST);
		expect(String(response.body)).toEqual('matomo_dashboard: unauthorized action');
		expect(response.status).toEqual(401);
	});
	test('should return 200', async () => {
		const response = await request(POST, {
			headers: {
				secret_token: process.env.ACTION_SECRET,
			},
		});
		expect(JSON.parse(response.body)).toEqual({ message: 'stats sent successfully' });
		expect(response.status).toEqual(200);
	});
});
