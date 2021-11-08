import cookie from 'cookie';
// jsonwebtoken is cjs module and has no  verify named export
import jwt from 'jsonwebtoken';
import type { RequestHandler } from '@sveltejs/kit';
import { getActionSecret, getJwtKey } from '$lib/config/variables/private';

export const authorizeOnly =
	(roles: string[]) =>
	(request: Parameters<RequestHandler>[0]): void => {
		const cookies = cookie.parse(request.headers.cookie || '');
		if (!cookies.jwt) {
			throw Error('Unauthorized access');
		}
		const { key, type } = getJwtKey();
		const user = jwt.verify(cookies.jwt, key, { algorithms: [type] }) as {
			role?: string;
		} | null;
		if (!user || !user.role || !roles.includes(user.role)) {
			throw Error('Unauthorized access');
		}
	};

export const actionsGuard = (headers: Record<string, string>): void => {
	const actionSecret = getActionSecret();
	console.log({ actionSecret });
	console.log(headers);
	if (actionSecret !== headers.secret_token) {
		throw Error('ACTION_SECRET header not match');
	}
};
