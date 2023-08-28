import type { LayoutServerLoad } from './$types';
import cookie from 'cookie';
import jwtDecode from 'jwt-decode';
import { redirect } from '@sveltejs/kit';
import { baseUrlForRole, homeForRole } from '$lib/routes';
import type { JwtPayload } from '$lib/utils/getJwt';
import { logger } from '$lib/utils/logger';

const authPages = ['/pro', '/admin', '/manager', '/structures', '/orientation', '/beneficiaire'];

function needAuth(pathname: string) {
	return authPages.some((page) => pathname.startsWith(page));
}

export const load: LayoutServerLoad = async (event) => {
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
		logger.warn('need auth');
		throw redirect(302, `/auth/login?redirect=${event.url.pathname}`);
	}

	return {
		user,
	};
};
