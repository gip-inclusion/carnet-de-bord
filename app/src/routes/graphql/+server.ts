import { getRealGraphqlAPI } from '$lib/config/variables/private';

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async ({ request, cookies }) => {
	const body = await request.text();
	const jwt = cookies.get('jwt');
	const authorization = `Bearer ${jwt}`;
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
