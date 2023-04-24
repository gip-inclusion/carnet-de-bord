import { getBackendAPI } from '$lib/config/variables/private';

import type { RequestHandler } from './$types';

export const POST = (async ({ request, cookies, params }) => {
	const url = `${getBackendAPI()}/v1/${params.rest}`;
	const body = await request.text();
	const jwt = cookies.get('jwt');

	return fetch(url, {
		method: 'POST',
		body,
		headers: {
			'Content-Type': request.headers.get('content-type'),
			accept: request.headers.get('accept'),
			'jwt-token': jwt,
			'Content-Disposition': request.headers.get('content-disposition') ?? null,
		},
	});
}) satisfies RequestHandler;
