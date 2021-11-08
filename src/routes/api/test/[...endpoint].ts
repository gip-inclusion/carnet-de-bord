import type { RequestHandler } from '@sveltejs/kit';
import source from '../fixtures.json';

export const get: RequestHandler = async (request) => {
	const { path, params, query, body, locals, headers } = request;
	console.log('TEST API', { headers, params, path, body, locals, query });
	return {
		status: 200,
		body: source,
	};
};
