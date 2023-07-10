import type { JwtPayload } from '$lib/utils/getJwt';
import jwtDecode from 'jwt-decode';
import type { PageServerLoad } from './$types';
import { getRealCarnetUrl } from '$lib/routes';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const user = jwtDecode<JwtPayload>(cookies.get('jwt'));

	const url = getRealCarnetUrl(user.role, params.notebook, user.structureId);

	console.log('redirect ', url);
	throw redirect(302, url);
};
