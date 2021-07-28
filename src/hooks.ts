import { getGraphqlAPI } from '$lib/config/variables/public';
import type { GetSession, Handle } from '@sveltejs/kit';
import cookie from 'cookie';
import { config } from 'dotenv';
import jwtDecode from 'jwt-decode';

config();

export const handle: Handle = async ({ request, resolve }) => {
	const cookies = cookie.parse(request.headers.cookie || '');
	if (cookies.jwt) {
		const user = jwtDecode(cookies.jwt);
		request.locals.user = user;
		request.locals.token = cookies.jwt;
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
		graphqlAPI: getGraphqlAPI()
	};

	return session;
};

export async function serverFetch(request: Request): Promise<Response> {
	return fetch(request);
}
