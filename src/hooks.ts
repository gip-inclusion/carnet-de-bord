import { getJwtKey } from '$lib/config/variables/private';
import { getGraphqlAPI } from '$lib/config/variables/public';
import type { GetSession, Handle } from '@sveltejs/kit';
import cookie from 'cookie';
import { config } from 'dotenv';
// jsonwebtoken is cjs module and has no  verify named export
import jwt from 'jsonwebtoken';

config();

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	if (cookies.jwt) {
		try {
			const { key, type } = getJwtKey();
			const user = jwt.verify(cookies.jwt, key, { algorithms: [type] });
			event.locals = { user, token: cookies.jwt };
		} catch (error) {
			event.locals = { user: null, token: null };
		}
	} else {
		event.locals = { user: null, token: null };
	}
	return await resolve(event);
};

export const getSession: GetSession = async (event) => {
	const session = event.locals['user']
		? {
				user: event.locals['user'],
				token: event.locals['token'],
				graphqlAPI: getGraphqlAPI(),
		  }
		: {};

	return session;
};

export async function serverFetch(request: Request): Promise<Response> {
	return fetch(request);
}
