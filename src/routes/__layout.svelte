<script context="module" lang="ts">
	import '@gouvfr/dsfr/dist/css/dsfr.min.css';
	import 'remixicon/fonts/remixicon.css';
	import '../app.css';
	import { setClient, Client } from '@urql/svelte';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import redirectUrl from '$lib/utils/redirectUrl';
	import createClient from '$lib/graphql/createClient';
	import { offCanvas } from '$lib/stores';
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
	setClient(client);
</script>

<svelte:head>
	{#if $offCanvas}
		<style>
			body {
				overflow: hidden;
			}
		</style>
	{/if}
</svelte:head>
<slot />
