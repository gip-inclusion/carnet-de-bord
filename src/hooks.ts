import { getJwtKey } from '$lib/config/variables/private';
import { getGraphqlAPI } from '$lib/config/variables/public';
import { authenticateWithBody, Session } from '$lib/utils/session';
import type { GetSession, Handle } from '@sveltejs/kit';
import cookie from 'cookie';
import { config } from 'dotenv';
// jsonwebtoken is cjs module and has no verify named export
import jwt from 'jsonwebtoken';

config();

export const handle: Handle = async ({ request, resolve }) => {
	// do nothing for login and auth routes
	if (['/auth/jwt', 'auth/logout'].includes(request.url.pathname)) {
		return await resolve(request);
	}
	// const userAgent = request.headers['user-agent'];
	// console.log({ userAgent });

	// try to look for a valid, non-expired JWT in the headers
	const jwtHeader = (request?.headers['Authorization'] ?? '').replace('Bearer ', '');
	if (jwtHeader) {
		const { key, type } = getJwtKey();
		try {
			// if we found a functional one, use that to populate locals
			const user = jwt.verify(jwtHeader, key, { algorithms: [type] });
			request.locals.user = user;
			request.locals.token = jwtHeader;
			return await resolve(request);
		} catch (error) {
			// ignore errors because there is a fallback
		}
	}

	// as a fallback, try to get a refreshToken from the cookies
	const cookies = cookie.parse(request.headers.cookie || '');
	if (cookies.refresh) {
		// if one is found, try to use it to refresh the JWT
		const session: Session = {};
		const body = JSON.stringify({ refreshToken: cookies.refresh });
		const result = await authenticateWithBody(body, session, request.url.origin);
		if (result) {
			// if it succeeds, we're happy
			request.locals.user = session.user;
			request.locals.token = session.token;
			const response = await resolve(request);
			const setCookieHeader = result.headers.get('set-cookie');
			response.headers['set-cookie'] = setCookieHeader;
			return response;
			// if it doesn't, we prepare for a login
		}
	}

	// if nothing worked, clean the refresh cookie
	const response = await resolve(request);
	const setCookieHeader = 'refresh=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
	response.headers['set-cookie'] = setCookieHeader;
	return response;
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
