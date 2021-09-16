import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = () => {
	return {
		headers: {
			'set-cookie': 'jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
		},
		body: {
			ok: true,
		},
	};
};
