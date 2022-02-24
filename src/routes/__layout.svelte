<script context="module" lang="ts">
	import '../app.css';

	import { setClient, Client } from '@urql/svelte';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import redirectUrl from '$lib/utils/redirectUrl';
	import createClient from '$lib/graphql/createClient';
	import { offCanvas } from '$lib/stores';
	import * as yup from 'yup';
	import * as yupFrLocale from '$lib/utils/yupFrLocale';
	import { onDestroy, onMount } from 'svelte';
	import * as Matomo from '$lib/tracking/matomo';

	export async function load({ url, session }: LoadInput): Promise<LoadOutput> {
		const redirect = redirectUrl(url, session);
		if (redirect) {
			return {
				status: 302,
				redirect,
			};
		}

		const client = createClient(session);
		console.log({ client, session });

		return {
			props: {
				client,
			},
		};
	}
	yup.setLocale(yupFrLocale);
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/env';
	import { getMatomoSiteId, getMatomoUrl } from '$lib/config/variables/public';

	export let client: Client;
	setClient(client);

	const MATOMO_URL = getMatomoUrl();
	const MATOMO_SITE_ID = getMatomoSiteId();

	let scrollbarWidth = '0';
	let unsubscribe: () => void;

	onMount(() => {
		const { body } = document;
		const scrollDiv = document.createElement('div');

		// Append element with defined styling
		scrollDiv.setAttribute(
			'style',
			'width: 100px; height: 100px; position: absolute; left: -9999px; overflow: scroll;'
		);
		body.appendChild(scrollDiv);

		scrollbarWidth = `${scrollDiv.offsetWidth - scrollDiv.clientWidth}px`;
		// Remove element
		body.removeChild(scrollDiv);
		body.style.setProperty('--scrollbarWidth', scrollbarWidth);

		Matomo.load(MATOMO_URL, MATOMO_SITE_ID);
	});
	unsubscribe = page.subscribe(({ url }) => {
		if (!browser || !url.pathname || !MATOMO_URL || !MATOMO_SITE_ID) {
			return;
		}
		// we don't want to track /auth/jwt
		if (/auth\/jwt/.test(url.pathname)) {
			return;
		}
		// Hack @lionelb: use a settimeout in order to get the correct
		// value of document.title once navigation occured
		setTimeout(() => {
			if (url.searchParams.has('search')) {
				Matomo.trackSiteSearch(url.searchParams.get('search'), url.pathname);
			} else {
				Matomo.trackPageView(url.href, document.title);
			}
		}, 100);
	});

	onDestroy(unsubscribe);
</script>

<svelte:head>
	{#if $offCanvas}
		<style>
			body {
				height: 100vh;
				overflow-y: hidden;
				padding-right: var(--scrollbarWidth);
			}
		</style>
	{/if}
</svelte:head>
<slot />
