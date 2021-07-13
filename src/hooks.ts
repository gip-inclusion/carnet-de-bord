import cookie from 'cookie';
import type { Handle, GetSession } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '$lib/variables';

export const handle: Handle = async ({ request, resolve }) => {
	const cookies = cookie.parse(request.headers.cookie || '');
	if (cookies.jwt) {
		const decoded: any = jwt.verify(cookies.jwt, JWT_SECRET_KEY);
		request.locals.user = decoded.user;
	}
	return await resolve(request);
};

export const getSession: GetSession = async ({ locals }) => {
	const session = {
		user: locals.user && {
			email: locals.user.email
		}
	};
	return session;
};

export async function serverFetch(request: Request): Promise<Response> {
	return fetch(request);
}
