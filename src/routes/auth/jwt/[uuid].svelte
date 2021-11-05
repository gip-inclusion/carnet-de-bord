<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	export async function load({ page }: LoadInput): Promise<LoadOutput> {
		const accessKey = page.params.uuid;
		const url = page.query.get('url');
		return {
			props: {
				accessKey,
				url,
			},
		};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { onMount } from 'svelte';
	import jwtDecode from 'jwt-decode';
	import { session } from '$app/stores';

	export let accessKey: string;
	export let url: string;
	export let displayError: boolean;

	onMount(async () => {
		const response: Response = await fetch(`/auth/jwt`, {
			method: 'POST',
			headers: {
				Accept: 'application/json; version=1.0',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				accessKey,
			}),
		});
		if (response.ok) {
			const { jwt } = await response.json();
			const user = jwtDecode(jwt);
			$session.user = user;
			$session.token = jwt;
			goto(url ? url : '/');
		} else {
			displayError = true;
		}
	});
</script>

<svelte:head>
	<title>validation du token de connexion - carnet de bord</title>
</svelte:head>
{#if displayError}
	<div class="pt-28 flex flex-col justify-items-center">
		<div class="pb-12 text-xl text-center">Désolé, ce lien n'est plus valide...</div>
		<a
			class="p-2 px-4 border-2 text-center border-accent text-accent rounded hover:bg-accent hover:text-white"
			href="/auth/login"
		>
			accéder à la page de connexion
		</a>
	</div>
{/if}
