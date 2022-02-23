import type { RequestHandler } from '@sveltejs/kit';
import source from '../fixtures.json';

export const get: RequestHandler = async ({ locals, url, params, request }) => {
	const { headers } = request;
	const { searchParams, pathname } = url;
	const body = await request.json();
	console.log('TEST API', { headers, params, pathname, body, locals, searchParams });
	return {
		status: 200,
		body: source,
	};
};
