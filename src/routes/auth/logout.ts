import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = ({ url }) => {
	const reason = url.searchParams.get('reason');
	return {
		headers: {
			'set-cookie': 'jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
			location: `/auth/login?${reason ? 'reason=expired' : ''}`,
		},
		status: 302,
	};
};
