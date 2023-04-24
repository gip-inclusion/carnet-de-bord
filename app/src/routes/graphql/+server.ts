import { getRealGraphqlAPI } from '$lib/config/variables/private';

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
	const body = await request.text();
	const authorization = request.headers.get('Authorization');
	const url = getRealGraphqlAPI();
	const response = await fetch(url, {
		method: 'POST',
		body,
		headers: {
			authorization,
		},
	});
	// TODO handle response code
	const responseBody = await response.json();
	return json(responseBody);
}) satisfies RequestHandler;
