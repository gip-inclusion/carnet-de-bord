import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import source from '../../marne/fixtures.json';

export const GET: RequestHandler = async ({ locals, url, params, request }) => {
	const { headers } = request;
	const { searchParams, pathname } = url;
	const body = await request.text();
	console.log('TEST API', { headers, params, pathname, body, locals, searchParams });
	return json(source);
};
