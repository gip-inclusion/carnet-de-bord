import { getBackendAPI } from '$lib/config/variables/private';

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async ({ request, cookies, params }) => {
	const url = `${getBackendAPI()}/v1/${params.rest}`;
	const body = await request.text();
	console.log({ request });
	const contentType = request.headers.get('content-type');
	const jwt = cookies.get('jwt');
	const response = await fetch(url, {
		method: 'POST',
		body,
		headers: {
			'Content-Type': contentType,
			accept: request.headers.get('accept'),
			'jwt-token': jwt,
		},
	});
	// TODO handle response code
	const responseBody = await response.json();
	return json(responseBody);
}) satisfies RequestHandler;
