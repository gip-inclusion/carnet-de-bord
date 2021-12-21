<script lang="ts">
	import type { RequestStep } from '$lib/types';
	import { post } from '$lib/utils/post';
	import { goto } from '$app/navigation';

	import ProCreationForm from '$lib/ui/ProCreationForm/index.svelte';
	import type { ProAccountWithStructureInput } from '$lib/ui/ProCreationForm/pro.schema';
	import Alert from '$lib/ui/base/Alert.svelte';

	let error: string;
	let requestStep: RequestStep = 'start';

	async function onSubmit(values: ProAccountWithStructureInput) {
		const { structureId, ...accountRequest } = values;
		const response = await post('/inscription/request', {
			accountRequest,
			structureId,
		});
		if (response.ok) {
			requestStep = 'success';
		} else {
			requestStep = 'error';
			const rawError = await response.json();
			if (response.status === 400) {
				error = `La creation de compte a échouée. ${rawError.errors.email}`;
			} else {
				error = 'La creation de compte a échouée. Veuillez contacter le support';
			}
		}
	}

	function onCancel() {
		goto('/auth/login');
	}
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
		<ProCreationForm {onSubmit} {onCancel} />
		{#if error}
			<div class="mb-8">
				<Alert type="error" description={error} />
			</div>
		{/if}
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
