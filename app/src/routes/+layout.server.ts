import type { LayoutServerLoad } from './$types';
import cookie from 'cookie';
import { getBackendAPI, getGraphqlAPI } from '$lib/config/variables/private';
import jwtDecode from 'jwt-decode';
import { redirect } from '@sveltejs/kit';
import { baseUrlForRole, homeForRole } from '$lib/routes';
import type { JwtPayload } from '$lib/utils/getJwt';

const authPages = ['/pro', '/admin', '/manager', '/structures', '/orientation', '/beneficiaire'];

function needAuth(pathname: string) {
	return authPages.some((page) => pathname.startsWith(page));
}

export const load: LayoutServerLoad = async (event) => {
	console.log('+layout.server', event.url.pathname);
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	let user: JwtPayload | null;

	if (cookies.jwt) {
		user = jwtDecode<JwtPayload>(cookies.jwt);
		if (
			event.url.pathname === '/' ||
			(needAuth(event.url.pathname) && !event.url.pathname.startsWith(baseUrlForRole(user.role)))
		) {
			throw redirect(302, homeForRole(user.role));
		}
	} else if (needAuth(event.url.pathname)) {
		throw redirect(302, '/auth/login');
	}

	return {
		user,
		token: cookies.jwt,
		backendAPI: getBackendAPI(),
		graphqlAPI: getGraphqlAPI(),
	};
};
