<script context="module" lang="ts">
	export async function load({ page }) {
		const accessKey = page.params.uuid;
		return {
			props: {
				accessKey
			}
		};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { session } from '$app/stores';
	import { onMount } from 'svelte';

	export let accessKey;

	onMount(async () => {
		const response: any = await fetch(`/auth/jwt`, {
			method: 'POST',
			headers: {
				Accept: 'application/json; version=1.0',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				accessKey
			})
		});
		const body = await response.json();
		if (body.user) {
			$session.user = body.user;
			goto('/');
		}
	});
</script>

<div class="pt-28 flex flex-col justify-items-center">
	<div class="pb-12 text-xl text-center">Désolé, ce lien n'est plus valide...</div>
	<a
		class="p-2 px-4 border-2 text-center border-accent text-accent rounded hover:bg-accent hover:text-white"
		href="/auth/login"
	>
		accéder à la page de connexion
	</a>
</div>
