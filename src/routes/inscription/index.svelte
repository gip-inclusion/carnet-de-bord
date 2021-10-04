<script lang="ts">
	import type { AccountRequest, RequestStep, Structure } from '$lib/types';
	import { post } from '$lib/utils/post';
	import { goto } from '$app/navigation';

	import ProCreationForm from '$lib/ui/ProCreationForm/index.svelte';

	let errors: AccountRequest = {};
	let accountRequest: AccountRequest = {};
	let requestStep: RequestStep = 'start';

	async function onSubmit(structure: Structure) {
		const response = await post('/inscription/request', {
			accountRequest,
			structureId: structure.id,
		});

		if (response.status === 400) {
			requestStep = 'error';
			errors = (await response.json()).errors as unknown as Record<keyof AccountRequest, string>;
		}

		if (response.status === 200) {
			requestStep = 'success';
		}
	}

	function onCancel() {
		goto('/auth/login');
	}

	function onInput() {
		requestStep = 'start';
	}

	$: disabled = requestStep === 'error';
</script>

<svelte:head>
	<title>Inscription - carnet de bord</title>
</svelte:head>
<div class="flex flex-col gap-8 px-40 mt-8">
	{#if requestStep !== 'success'}
		<div>
			<h1>Inscription au Carnet de bord</h1>
			<p>Veuillez remplir le formulaire pour vous inscrire.</p>
		</div>
		<ProCreationForm {accountRequest} {errors} {disabled} {onSubmit} {onCancel} {onInput} />
	{:else}
		<div>
			<h1>Demande d'inscription envoyée</h1>
			<p>Nous avons bien pris en compte votre demande de nouvelle inscription.</p>
			<p>
				Vous recevrez un courriel de confirmation, avec un lien pour vous connecter au Carnet de
				bord.
			</p>
		</div>
	{/if}
</div>
