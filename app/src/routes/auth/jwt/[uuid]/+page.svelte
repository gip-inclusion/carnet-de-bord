<script lang="ts">
	import { Button, Spinner } from '$lib/ui/base';

	import type { PageServerData } from './$types';
	export let data: PageServerData;

	$: isLoading = false;

	async function login() {
		const body = new FormData();
		body.set('token', data.token);
		body.set('accountId', data.accountId);
		await fetch(`/auth/jwt/${data.accessKey}`, { method: 'POST', body });

		window.location.replace(data.redirectAfterLogin ?? '/');
	}
</script>

<div class="pt-28 flex flex-col grow items-center">
	<p class="pb-12 text-xl">Votre lien magique est valide.</p>
	{#if isLoading}
		<Spinner />
	{:else}
		<Button on:click={login} title="Continuer">Continuer sur Carnet de bord</Button>
	{/if}
</div>
