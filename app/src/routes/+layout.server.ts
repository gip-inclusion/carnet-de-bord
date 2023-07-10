import type { LayoutServerLoad } from './$types';
import jwtDecode from 'jwt-decode';
import { redirect } from '@sveltejs/kit';
import { baseUrlForRole, homeForRole } from '$lib/routes';
import type { JwtPayload } from '$lib/utils/getJwt';

const authPages = [
	'/carnet',
	'/pro',
	'/admin',
	'/manager',
	'/structures',
	'/orientation',
	'/beneficiaire',
];

function needAuth(pathname: string) {
	return authPages.some((page) => pathname.startsWith(page));
}

export const load: LayoutServerLoad = async (event) => {
	let user: JwtPayload | null;
	if (event.cookies.get('jwt')) {
		user = jwtDecode<JwtPayload>(event.cookies.get('jwt'));

		if (
			event.url.pathname === '/' ||
			(needAuth(event.url.pathname) &&
				!event.url.pathname.startsWith(baseUrlForRole(user.role)) &&
				!event.url.pathname.startsWith('/carnet'))
		) {
			throw redirect(302, homeForRole(user.role));
		}
	} else if (needAuth(event.url.pathname)) {
		throw redirect(302, '/auth/login');
	}

	return {
		user,
	};
};
