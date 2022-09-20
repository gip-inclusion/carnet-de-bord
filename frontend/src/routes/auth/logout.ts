import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = () => {
	return {
		headers: {
			'set-cookie': 'jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
			location: '/',
		},
		status: 302,
	};
};
