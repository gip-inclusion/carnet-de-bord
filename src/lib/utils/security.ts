import cookie from 'cookie';
import jwtDecode from 'jwt-decode';
import type { RequestHandler } from '@sveltejs/kit';

export const authorizeOnly =
	(roles: string[]) =>
	(request: Parameters<RequestHandler>[0]): void => {
		const cookies = cookie.parse(request.headers.cookie || '');
		if (!cookies.jwt) {
			throw Error('Unauthorized access');
		}
		const user = jwtDecode(cookies.jwt) as { role?: string } | null;
		if (!user || !user.role || !roles.includes(user.role)) {
			throw Error('Unauthorized access');
		}
	};
