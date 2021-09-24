<script context="module" lang="ts">
	import '@gouvfr/dsfr/dist/css/dsfr.min.css';
	import 'remixicon/fonts/remixicon.css';
	import '../app.css';
	import { setClient, Client } from '@urql/svelte';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import redirectUrl from '$lib/utils/redirectUrl';
	import createClient from '$lib/graphql/createClient';
	import { offCanvas } from '$lib/stores';

	import { onMount } from 'svelte';

	export async function load({ context, page, session }: LoadInput): Promise<LoadOutput> {
		const redirect = redirectUrl(page, session);
		if (redirect) {
			return {
				status: 302,
				redirect,
			};
		}

		const client = createClient(session);

		return {
			props: { client },
			context: {
				...context,
				client,
			},
		};
	}
</script>

<script lang="ts">
	export let client: Client;
	let scrollbarWidth = '0';
	setClient(client);

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
	});
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
