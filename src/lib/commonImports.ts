import 'remixicon/fonts/remixicon.css';
import '../app.postcss';
import '@gouvfr/dsfr/dist/css/dsfr.min.css';
import type { LoadInput, LoadOutput } from '@sveltejs/kit';
import createClient from './graphql/createClient';
import redirectUrl from './utils/redirectUrl';

export async function load({ page, session }: LoadInput): Promise<LoadOutput> {
	const redirect = redirectUrl(page, session);

	if (redirect) {
		return {
			status: 302,
			redirect
		};
	}

	const client = createClient(session);

	return {
		props: { client }
	};
}
