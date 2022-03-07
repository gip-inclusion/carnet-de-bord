import type { RequestHandler } from '@sveltejs/kit';
import { makeCookie } from './jwt';

export const get: RequestHandler = ({ url }) => {
	console.log('wut');
	const reason = url.searchParams.get('reason');
	const param = reason ? `reason=${reason}` : '';
	console.log('dafuq');
	return {
		headers: {
			'set-cookie': makeCookie('deleted', new Date(0).toUTCString()),
			location: `/auth/login?${param}`,
		},
		status: 302,
	};
};
