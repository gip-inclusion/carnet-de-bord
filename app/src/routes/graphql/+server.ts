import { getGraphqlAPI } from '$lib/config/variables/private';

import type { RequestHandler } from './$types';

export const POST = (async ({ request, cookies }) => {
	const body = await request.text();
	const jwt = cookies.get('jwt');
	const url = getGraphqlAPI();
	return fetch(url, {
		method: 'POST',
		body,
		headers: {
			Accept: 'application/json; version=1.0',
			...(jwt ? { authorization: `Bearer ${jwt}` } : {}),

			// Prevent the fetch implementation (undici most likely) from requesting
			// compressed data from the upstream server. Because the same fetch implementation
			// automatically uncompresses the received data, it would make work for this proxy
			// and require us to scrub the 'Content-Encoding' header from the response before
			// forwarding it.
			// The Scalingo router will compress our responses for the client if necessary in
			// any case.
			'Accept-Encoding': 'identity',
		},
	});
}) satisfies RequestHandler;
