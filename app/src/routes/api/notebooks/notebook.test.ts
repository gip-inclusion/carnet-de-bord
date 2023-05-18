import { describe, test, type Mock } from 'vitest';
import { POST } from './+server';
import { createFakeRequestEvent, createFetchResponse } from '../../../../setupTest';

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

		expect(POST(requestEvent)).rejects.toMatchInlineSnapshot(`
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

		expect(POST(requestEvent)).rejects.toMatchInlineSnapshot(`
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

		expect(POST(requestEvent)).rejects.toMatchInlineSnapshot(`
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

		expect(POST(requestEvent)).rejects.toMatchInlineSnapshot(`
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
			}
		);

		expect(POST(requestEvent)).rejects.toMatchInlineSnapshot(`
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
			}
		);

		expect(POST(requestEvent)).rejects.toMatchInlineSnapshot(`
			HttpError {
			  "body": {
			    "message": "manager account not found",
			  },
			  "status": 400,
			}
		`);
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
		const requestEvent = createFakeRequestEvent(
			'POST',
			{ authorization: 'Bearer secret_api_token' },
			{
				deploymentId: 'f228a518-0d93-4d94-94f9-4724b5ae8730',
				rdviUserEmail: 'contact+cd93@carnetdebord.inclusion.beta.gouv.fr',
			}
		);

		await POST(requestEvent);
		//TODO: ensure we call Hasura action
		expect(fetch).toHaveBeenCalledTimes(2);
	});
});
