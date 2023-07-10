import type { JwtPayload } from '$lib/utils/getJwt';
import jwtDecode from 'jwt-decode';
import type { PageServerLoad } from './$types';
import { homeForRole } from '$lib/routes';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, params }) => {
	console.log('+page.server / cookies', cookies.get('jwt'));
	const user = jwtDecode<JwtPayload>(cookies.get('jwt'));

	let url = `${homeForRole(user.role)}`;
	console.log({ url });
	if (user?.role) {
		url += `/carnet/${params.notebook}`;
	}
	console.log('redirect ', url);
	throw redirect(302, url);
};
