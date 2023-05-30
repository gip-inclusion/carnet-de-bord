<script lang="ts">
	import '../app.css';

	// DSFR Assets
	import appleTouchFavicon from '@gouvfr/dsfr/dist/favicon/apple-touch-icon.png';
	import svgFavicon from '@gouvfr/dsfr/dist/favicon/favicon.svg';
	import icoFavicon from '@gouvfr/dsfr/dist/favicon/favicon.ico';
	import { onDestroy, onMount } from 'svelte';

	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { connectedUser, offCanvas } from '$lib/stores';
	import type { PageData } from './$types';

	import * as yup from 'yup';
	import * as yupFrLocale from '$lib/utils/yupFrLocale';
	import { Client, createClient, setClient } from '@urql/svelte';
	import LayerCdb from '$lib/ui/LayerCDB.svelte';

	yup.setLocale(yupFrLocale);

	let scrollbarWidth = '0';

	export let data: PageData;

	const client: Client = createClient({ url: '/graphql', fetch });

	setClient(client);

	$: {
		$connectedUser = data.user;
	}
	let unsubscribePage: () => void;

	unsubscribePage = page.subscribe(trackPageView);

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
	});

	onDestroy(() => unsubscribePage());

	function trackPageView() {
		// we don't want to track /auth/jwt
		if (/auth\/jwt/.test($page.url.pathname)) {
			return;
		}
		if (browser && (window as any)._paq) {
			(window as any)._paq.push(['setCustomUrl', $page.url.pathname]);
			(window as any)._paq.push(['setDocumentTitle', $page.data.title]);
			if ($page.url.searchParams.get('search')) {
				(window as any)._paq.push(['trackSiteSearch', $page.url.href, $page.url.pathname]);
			} else {
				(window as any)._paq.push(['trackPageView']);
			}
		}
	}
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

<LayerCdb />

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
