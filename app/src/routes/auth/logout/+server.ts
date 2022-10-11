import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
	throw new Error(
		'@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)'
	);
	return {
		headers: {
			'set-cookie': 'jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
			location: '/',
		},
		status: 302,
	};
};
