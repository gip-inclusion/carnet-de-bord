import cookie from 'cookie';
// jsonwebtoken is cjs module and has no  verify named export
import jwt from 'jsonwebtoken';
import { getActionSecret, getJwtKey } from '$lib/config/variables/private';

export const authorizeOnly =
	(roles: string[]) =>
	(request: Request): void => {
		const cookies = cookie.parse(request.headers.get('cookie') || '');
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

export const actionsGuard = (headers: Headers): void => {
	const actionSecret = getActionSecret();
	if (actionSecret !== headers.get('secret_token')) {
		throw Error('ACTION_SECRET header does not match');
	}
};
