<script lang="ts">
	import '../app.css';

	// DSFR Assets
	import appleTouchFavicon from '@gouvfr/dsfr/dist/favicon/apple-touch-icon.png';
	import svgFavicon from '@gouvfr/dsfr/dist/favicon/favicon.svg';
	import icoFavicon from '@gouvfr/dsfr/dist/favicon/favicon.ico';
	import { onDestroy, onMount } from 'svelte';
	import * as Matomo from '$lib/tracking/matomo';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { connectedUser, offCanvas } from '$lib/stores';
	import type { PageData } from './$types';

	import * as yup from 'yup';
	import * as yupFrLocale from '$lib/utils/yupFrLocale';
	import createClient from '$lib/graphql/createClient';
	import { Client, setClient } from '@urql/svelte';
	import LayerCdb from '$lib/ui/LayerCDB.svelte';
	import { getMatomoUrl, getMatomoSiteId } from '$lib/config/variables/public';

	yup.setLocale(yupFrLocale);

	let scrollbarWidth = '0';

	export let data: PageData;

	let client: Client;

	$: {
		client = createClient(fetch);
		setClient(client);
		$connectedUser = data.user;
	}

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

		Matomo.load(getMatomoUrl(), getMatomoSiteId());
	});
	const unsubscribe = page.subscribe(({ url }) => {
		if (!browser || !url.pathname || !getMatomoUrl() || !getMatomoSiteId()) {
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
	<!-- 32×32 -->
	<link rel="shortcut icon" href={icoFavicon} type="image/x-icon" />
</svelte:head>

<slot />

{#key data.user}
	<LayerCdb />
{/key}

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
		z-index: 501;
		top: 0.3rem;
		left: -1.8rem;
		transform: rotate(-45deg);
	}
</style>
