<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import { authenticateWithBody } from '$lib/utils/session';
	export async function load({ url, params }: LoadInput): Promise<LoadOutput> {
		const accessKey = params.uuid;
		const u = url.searchParams.get('url');
		return {
			props: {
				accessKey,
				url: u,
			},
		};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { session } from '$app/stores';
	import { homeForRole } from '$lib/routes';

	export let accessKey: string;
	export let url: string;
	export let displayError = false;

	onMount(async () => {
		const body = JSON.stringify({
			accessKey,
		});

		if (await authenticateWithBody(body, $session)) {
			goto(url ? url : homeForRole($session.user.role));
		} else {
			displayError = true;
		}
	});
</script>

<svelte:head>
	<title>Validation du token de connexion - Carnet de bord</title>
</svelte:head>
{#if displayError}
	<div class="pt-28 flex flex-col justify-items-center">
		<div class="pb-12 text-xl text-center">Désolé, ce lien n'est plus valide...</div>
		<a
			class="p-2 px-4 border-2 text-center border-accent text-accent rounded hover:bg-accent hover:text-white"
			href="/auth/login"
		>
			Accéder à la page de connexion
		</a>
	</div>
{/if}
