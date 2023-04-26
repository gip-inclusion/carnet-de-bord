import { getBackendAPI } from '$lib/config/variables/private';

import type { RequestHandler } from './$types';

export const POST = (async ({ request, cookies, params }) => {
	const url = `${getBackendAPI()}/v1/${params.rest}`;
	const body = await request.blob();
	const jwt = cookies.get('jwt');
	return fetch(url, {
		method: 'POST',
		body,
		headers: {
			'Content-Type': request.headers.get('content-type'),
			accept: request.headers.get('accept'),
			Authorization: `Bearer ${jwt}`,
			...(request.headers.get('content-disposition')
				? { 'Content-Disposition': request.headers.get('content-disposition') }
				: null),
		},
	});
}) satisfies RequestHandler;
