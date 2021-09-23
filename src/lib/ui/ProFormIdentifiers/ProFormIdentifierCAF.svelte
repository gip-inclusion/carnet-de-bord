<script lang="ts">
	import type { ExternalUser } from '$lib/types';

	import * as RD from '$lib/remoteData';
	import { Button, Input } from '$lib/ui/base';
	import { post } from '$lib/utils/post';

	async function handleSubmit() {
		users = RD.loading;
		const response = await post('/pro/queryUser', { service: 'CAF', data: { postalCode, idCAF } });
		if (response.status >= 400) {
			users = RD.failure((await response.json()).error);
		}
		if (response.status === 200) {
			users = RD.success((await response.json()).users);
		}
		return;
	}

	function resetFetchedUser() {
		users = RD.notAsked;
	}

	let postalCode = '';
	let idCAF = '';
	let errors: { postalCode?: string; idCAF?: string } = {};

	export let users: RD.RemoteData<ExternalUser[], string> = RD.notAsked;
</script>

<div class="font-bold mb-6">Veuillez saisir l'identifiant CAF.</div>
<form on:submit|preventDefault={handleSubmit} class="mb-6">
	<div class="flex flex-row gap-6">
		<Input
			bind:val={postalCode}
			inputHint={'Ex : 75 008'}
			inputLabel={'Code postal'}
			error={errors.postalCode}
			on:input={resetFetchedUser}
		/>
		<Input
			bind:val={idCAF}
			inputHint={'Ex : XXXXXXX46468'}
			inputLabel={'Identifiant CAF'}
			error={errors.idCAF}
			on:input={resetFetchedUser}
		/>
		<div class="self-center">
			<Button outline={true} type="submit">Rechercher</Button>
		</div>
	</div>
	<div class="flex flex-col gap-6">
		{#if RD.isLoading(users)}
			<span class="ri ri-refresh-line" />
		{:else if RD.isFailure(users)}
			Une erreur s'est produite : {RD.getError(users) || 'Erreur inconnue'}
		{/if}
	</div>
</form>
