import { describe, test, type Mock } from 'vitest';
import { POST } from './+server';
import { createFakeRequestEvent, createFetchResponse } from '../../../../setupTest';
import { getGraphqlAPI } from '$lib/config/variables/private';

// this allows to mock fetch function used inside createGraphqlAdminClient
vi.mock('../../../lib/graphql/createAdminClient', async () => {
	const mod = await vi.importActual<typeof import('../../../lib/graphql/createAdminClient')>(
		'../../../lib/graphql/createAdminClient'
	);
	vi.stubGlobal('fetch', vi.fn());
	return {
		createGraphqlAdminClient: () => mod.createGraphqlAdminClient(),
	};
});
vi.mock('@urql/core', async () => {
	const mod = await vi.importActual<typeof import('@urql/core')>('@urql/core');
	vi.stubGlobal('fetch', vi.fn());
	return {
		createClient: (fetchOptions) => mod.createClient({ ...fetchOptions, fetch }),
	};
});

describe('notebook api endpoint', () => {
	beforeEach(() => {
		(fetch as Mock).mockReset();
	});
	test('should return 401 with no authorization', async () => {
		const requestEvent = createFakeRequestEvent(
			'POST',
			{},
			{
				deploymentId: 'f228a518-0d93-4d94-94f9-4724b5ae8730',
				rdviUserEmail: ' ',
			}
		);

		await expect(POST(requestEvent)).rejects.toMatchInlineSnapshot(`
			HttpError {
			  "body": {
			    "message": "missing authorization",
			  },
			  "status": 401,
			}
		`);
	});

	test('should return 403 with wrong authorization', async () => {
		const requestEvent = createFakeRequestEvent(
			'POST',
			{ authorization: 'miaou' },
			{
				deploymentId: 'f228a518-0d93-4d94-94f9-4724b5ae8730',
				rdviUserEmail: ' ',
			}
		);

		await expect(POST(requestEvent)).rejects.toMatchInlineSnapshot(`
			HttpError {
			  "body": {
			    "message": "wrong authorization",
			  },
			  "status": 403,
			}
		`);
	});

	test('should return 422 if body is missing', async () => {
		const requestEvent = createFakeRequestEvent(
			'POST',
			{ authorization: 'Bearer secret_api_token' },
			null
		);

		await expect(POST(requestEvent)).rejects.toMatchInlineSnapshot(`
			HttpError {
			  "body": {
			    "message": "deploymentId is a required field",
			  },
			  "status": 422,
			}
		`);
	});

	test('should return 422 if body has wrong shape', async () => {
		const requestEvent = createFakeRequestEvent(
			'POST',
			{ authorization: 'Bearer secret_api_token' },
			{}
		);

		await expect(POST(requestEvent)).rejects.toMatchInlineSnapshot(`
			HttpError {
			  "body": {
			    "message": "deploymentId is a required field",
			  },
			  "status": 422,
			}
		`);
	});

	test('should return 500 if graphql fails', async () => {
		(fetch as Mock).mockRejectedValueOnce(new Error('Network error'));
		const requestEvent = createFakeRequestEvent(
			'POST',
			{ authorization: 'Bearer secret_api_token' },
			{
				deploymentId: 'f228a518-0d93-4d94-94f9-4724b5ae8730',
				rdviUserEmail: 'hans@carnetdebord.inclusion.beta.gouv.fr',
				notebook: {
					dateOfBirth: '2001-12-03',
					nir: '12345678901234',
					firstname: 'lionel',
					lastname: 'breduillieard',
				},
			}
		);

		await expect(POST(requestEvent)).rejects.toMatchInlineSnapshot(`
			HttpError {
			  "body": {
			    "message": "Internal server error",
			  },
			  "status": 500,
			}
		`);
	});
	test('should return 400 if no manager found', async () => {
		(fetch as Mock).mockResolvedValueOnce(createFetchResponse(200, { data: { account: [] } }));
		const requestEvent = createFakeRequestEvent(
			'POST',
			{ authorization: 'Bearer secret_api_token' },
			{
				deploymentId: 'f228a518-0d93-4d94-94f9-4724b5ae8730',
				rdviUserEmail: 'contact+cd93@carnetdebord.inclusion.beta.gouv.fr',
				notebook: {
					dateOfBirth: '2001-12-03',
					nir: '12345678901234',
					firstname: 'lionel',
					lastname: 'breduillieard',
				},
			}
		);

		await expect(POST(requestEvent)).rejects.toMatchInlineSnapshot(`
			HttpError {
			  "body": {
			    "message": "manager account not found",
			  },
			  "status": 400,
			}
		`);
	});

	test('should return 409 if action return an alerady exist error', async () => {
		(fetch as Mock).mockResolvedValueOnce(
			createFetchResponse(200, {
				data: {
					account: [
						{
							id: '70666617-e276-4135-8bed-a4255d28dbd4',
							type: 'manager',
						},
					],
				},
			})
		);
		(fetch as Mock).mockResolvedValueOnce(
			createFetchResponse(200, {
				errors: [
					{
						message: 'notebook already exists',
						extensions: {
							notebookId: '70666617-e276-4135-8bed-a4255d28dbd4',
						},
					},
				],
			})
		);
		const requestEvent = createFakeRequestEvent(
			'POST',
			{ authorization: 'Bearer secret_api_token' },
			{
				deploymentId: 'f228a518-0d93-4d94-94f9-4724b5ae8730',
				rdviUserEmail: 'contact+cd93@carnetdebord.inclusion.beta.gouv.fr',
				notebook: {
					dateOfBirth: '2001-12-03',
					nir: '12345678901234',
					firstname: 'lionel',
					lastname: 'breduillieard',
				},
			}
		);

		await expect(POST(requestEvent)).rejects.toMatchInlineSnapshot(`
			HttpError {
			  "body": {
			    "extensions": {
			      "notebookId": "70666617-e276-4135-8bed-a4255d28dbd4",
			    },
			    "locations": undefined,
			    "message": "notebook already exists",
			    "path": undefined,
			  },
			  "status": 409,
			}
		`);
		expect(fetch).toHaveBeenCalledTimes(2);
	});

	test('should return 200 if payload is correct', async () => {
		(fetch as Mock).mockResolvedValueOnce(
			createFetchResponse(200, {
				data: {
					account: [
						{
							id: '70666617-e276-4135-8bed-a4255d28dbd4',
							type: 'manager',
						},
					],
				},
			})
		);
		(fetch as Mock).mockResolvedValueOnce(
			createFetchResponse(200, {
				data: {
					create_notebook: {
						notebookId: '70666617-e276-4135-8bed-a4255d28dbd4',
					},
				},
			})
		);
		const requestEvent = createFakeRequestEvent(
			'POST',
			{ authorization: 'Bearer secret_api_token' },
			{
				deploymentId: 'f228a518-0d93-4d94-94f9-4724b5ae8730',
				rdviUserEmail: 'contact+cd93@carnetdebord.inclusion.beta.gouv.fr',
				notebook: {
					dateOfBirth: '2001-12-03',
					nir: '12345678901234',
					firstname: 'lionel',
					lastname: 'breduillieard',
				},
			}
		);

		await POST(requestEvent);
		expect(fetch).toHaveBeenCalledTimes(2);
		const params = (fetch as Mock).mock.lastCall;
		expect(params[0]).toMatch(getGraphqlAPI());
		expect(params[1].body).toContain('create_notebook');
	});
});
