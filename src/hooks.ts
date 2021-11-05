import { getJwtKey } from '$lib/config/variables/private';
import { getGraphqlAPI } from '$lib/config/variables/public';
import type { GetSession, Handle } from '@sveltejs/kit';
import cookie from 'cookie';
import { config } from 'dotenv';
// jsonwebtoken is cjs module and has no  verify named export
import jwt from 'jsonwebtoken';

config();

export const handle: Handle = async ({ request, resolve }) => {
	const cookies = cookie.parse(request.headers.cookie || '');
	if (cookies.jwt) {
		try {
			const { key, type } = getJwtKey();
			const user = jwt.verify(cookies.jwt, key, { algorithms: [type] });
			request.locals.user = user;
			request.locals.token = cookies.jwt;
		} catch (error) {
			request.locals.user = null;
			request.locals.token = null;
		}
	} else {
		request.locals.user = null;
		request.locals.token = null;
	}
	return await resolve(request);
};

export const getSession: GetSession = async ({ locals }) => {
	const session = {
		user: locals.user,
		token: locals.token,
		graphqlAPI: getGraphqlAPI(),
	};

	return session;
};

export async function serverFetch(request: Request): Promise<Response> {
	return fetch(request);
}
