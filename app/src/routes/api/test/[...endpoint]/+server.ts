import { json as json$1 } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import source from '../../fixtures.json';

export const GET: RequestHandler = async ({ locals, url, params, request }) => {
	const { headers } = request;
	const { searchParams, pathname } = url;
	const body = await request.text();
	console.log('TEST API', { headers, params, pathname, body, locals, searchParams });
	throw new Error(
		'@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)'
	);
	// Suggestion (check for correctness before using):
	// return json$1(source);
	return {
		status: 200,
		body: source,
	};
};
