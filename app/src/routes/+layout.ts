import { redirect } from '@sveltejs/kit';
import '../app.css';

import type { Client } from '@urql/core';
import type { LoadEvent, LoadOutput } from '@sveltejs/kit';
import redirectUrl from '$lib/utils/redirectUrl';
import createClient from '$lib/graphql/createClient';
import { offCanvas } from '$lib/stores';
import * as yup from 'yup';
import * as yupFrLocale from '$lib/utils/yupFrLocale';
import { onDestroy, onMount } from 'svelte';
import * as Matomo from '$lib/tracking/matomo';

export async function load({ url, session }: LoadEvent): Promise<LoadOutput> {
	try {
		const redirect = redirectUrl(url, session);
		if (redirect) {
			throw redirect(302, redirect);
		}
	} catch (error) {
		throw redirect(302, '/auth/logout');
	}

	const client: Client = createClient(session);

	return {
		client,
	};
}
yup.setLocale(yupFrLocale);
