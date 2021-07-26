import cookie from 'cookie';
import type { Handle, GetSession } from '@sveltejs/kit';
import jwtDecode from 'jwt-decode';

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
		user: locals.user && {
			id: locals.user.id,
			role: locals.user.role
		},
		token: locals.token,
		graphqlAPI: process.env['VITE_GRAPHQL_API_URL']
	};

	return session;
};

export async function serverFetch(request: Request): Promise<Response> {
	return fetch(request);
}
