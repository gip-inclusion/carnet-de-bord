import { getBackendAPI } from '$lib/config/variables/private';

import type { RequestHandler } from './$types';

export const POST = (async ({ request, cookies, params }) => {
	const url = `${getBackendAPI()}/v1/${params.endpoint}`;
	const body = request.body;
	const jwt = cookies.get('jwt');
	return fetch(url, {
		method: 'POST',
		body,
		duplex: 'half',
		headers: {
			'Content-Type': request.headers.get('content-type'),
			accept: request.headers.get('accept'),
			Authorization: `Bearer ${jwt}`,
			...(request.headers.get('content-disposition')
				? { 'Content-Disposition': request.headers.get('content-disposition') }
				: null),
		},
		// A cast to RequestInit is required because TypeScript's idea of fetch is outdated
		// and does not know about "duplex", while the "fetch" polyfill provided by
		// SvelteKit requires "duplex" to be set when providing the body as a ReadableStream.
	} as RequestInit);
}) satisfies RequestHandler;
