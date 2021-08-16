import { getGraphqlAPI } from '$lib/config/variables/public';
import { createClient } from '@urql/svelte';

import 'remixicon/fonts/remixicon.css';
import '../app.postcss';
import '@gouvfr/dsfr/dist/css/dsfr.min.css';
import type { LoadInput, LoadOutput } from '@sveltejs/kit';

function getToken(session: { token?: string }) {
	return session.token;
}
export async function load({ page, fetch, session }: LoadInput): Promise<LoadOutput> {
	const graphqlAPI = session.graphqlAPI ? session.graphqlAPI : getGraphqlAPI();
	if (page.path === '/healthz') {
		return {};
	}
	if (!session.user && !page.path.startsWith('/auth')) {
		return {
			status: 302,
			redirect: '/auth/login'
		};
	}
	if (session.user && page.path.startsWith('/auth')) {
		return {
			status: 302,
			redirect: '/'
		};
	}
	const client = createClient({
		url: graphqlAPI,
		fetch,
		fetchOptions: () => {
			const token = getToken(session);
			if (token) {
				return {
					headers: { authorization: token ? `Bearer ${token}` : '' }
				};
			}
			return {};
		}
	});

	return {
		props: { client }
	};
}
