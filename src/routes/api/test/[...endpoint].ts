import type { RequestHandler } from '@sveltejs/kit';
import source from '../fixtures.json';

export const get: RequestHandler = async (request) => {
	const { url, params, body, locals, headers } = request;
	const { pathname, searchParams } = url;
	console.log('TEST API', { headers, params, pathname, body, locals, searchParams });
	return {
		status: 200,
		body: source,
	};
};
