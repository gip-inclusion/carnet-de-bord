import '../app.css';

import { redirect } from '@sveltejs/kit';

import type { Client } from '@urql/core';
import redirectUrl from '$lib/utils/redirectUrl';
import createClient from '$lib/graphql/createClient';
import * as yup from 'yup';
import * as yupFrLocale from '$lib/utils/yupFrLocale';
import type { LayoutServerLoad } from './$types';
import cookie from 'cookie';
import { getBackendAPI, getGraphqlAPI, getJwtKey } from '$lib/config/variables/private';
import jwtDecode from 'jwt-decode';

export const load: LayoutServerLoad = (event) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	let user, token;

	if (cookies.jwt) {
		user = jwtDecode(cookies.jwt);
		token = cookies.jwt;
	}
	// try {
	// 	const redirection = redirectUrl(event.url, event.locals.user);
	// 	if (redirect) {
	// 		throw redirect(302, redirection);
	// 	}
	// } catch (error) {
	// 	throw redirect(302, '/auth/logout');
	// }

	// const client: Client = createClient(event.locals.graphqlAPI, event.locals.token);

	return {
		user,
		token: cookies.jwt,
		backendAPI: getBackendAPI(),
		graphqlAPI: getGraphqlAPI(),
	};
};

yup.setLocale(yupFrLocale);
