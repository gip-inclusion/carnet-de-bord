<script context="module" lang="ts">
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
				return {
					status: 302,
					redirect,
				};
			}
		} catch (error) {
			return {
				status: 302,
				redirect: '/auth/logout',
			};
		}

		const client: Client = createClient(session);

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
	import { setClient } from '@urql/svelte';
	// DSFR Assets
	import appleTouchFavicon from '@gouvfr/dsfr/dist/favicon/apple-touch-icon.png';
	import svgFavicon from '@gouvfr/dsfr/dist/favicon/favicon.svg';
	import icoFavicon from '@gouvfr/dsfr/dist/favicon/favicon.ico';
	import manifest from '@gouvfr/dsfr/dist/favicon/manifest.webmanifest';

	export let client: Client;
	setClient(client);

	const MATOMO_URL = getMatomoUrl();
	const MATOMO_SITE_ID = getMatomoSiteId();

	let scrollbarWidth = '0';
	let unsubscribe: () => void;

	onMount(async () => {
		// Load the DSFR asynchronously, and only on the browser (not in SSR).
		await import('@gouvfr/dsfr/dist/dsfr/dsfr.module.min.js');

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
	<link rel="apple-touch-icon" href={appleTouchFavicon} />
	<!-- 180×180 -->
	<link rel="icon" href={svgFavicon} type="image/svg+xml" />
	<link rel="shortcut icon" href={icoFavicon} type="image/x-icon" />
	<!-- 32×32 -->
	<link rel="manifest" href={manifest} crossorigin="use-credentials" />
</svelte:head>

<slot />

<style>
	:global(body::after) {
		content: 'BETA';
		color: #fff;
		background: #d63626;
		text-align: center;
		font-size: 1.2rem;
		font-weight: bold;
		padding: 0.2rem 1.9rem;
		position: fixed;
		z-index: 2;
		top: 0.3rem;
		left: -1.8rem;
		transform: rotate(-45deg);
	}
</style>
