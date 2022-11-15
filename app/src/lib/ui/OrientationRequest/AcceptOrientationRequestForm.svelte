<script lang="ts">
	import type { GetNotebookByBeneficiaryIdQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { Select } from '../base';
	import Button from '../base/Button.svelte';
	import { openComponent } from '$lib/stores';
	import Alert from '../base/Alert.svelte';

	export let orientationRequest: GetNotebookByBeneficiaryIdQuery['notebook'][0]['beneficiary']['orientationRequest'][0];

	let selectedMember: string = null;
	let selectedOrientationType: string = null;
	let selectedStructure: string = null;
	let error = false;

	async function handleSubmit() {
		console.log(`Acceptation de la demande ${orientationRequest}`);
		error = true;
	}

	function close() {
		openComponent.close();
	}
</script>

<section class="flex flex-col w-full">
	<h1>Réorientation des bénéficiaires</h1>
	<form on:submit|preventDefault={handleSubmit}>
		<p>
			Veuillez sélectionner l'orientation ansi que la nouvelle structure et/ou le nouveau référent.
		</p>
		<Select
			bind:selected={selectedOrientationType}
			selectLabel="Orientation"
			selectHint="Sélectionner..."
			options={[
				{ name: 'test', label: 'test' },
				{ name: 'test2', label: 'test2' },
			]}
			name="orientationType"
			id="orientationType"
		/>
		<Select
			bind:selected={selectedMember}
			selectLabel="Structure d‘accompagnement"
			selectHint="Sélectionner..."
			options={[
				{ name: 'test', label: 'test' },
				{ name: 'test2', label: 'test2' },
			]}
			name="structure"
			id="structure"
		/>
		<Select
			bind:selected={selectedStructure}
			selectLabel="Référent unique"
			selectHint="Sélectionner..."
			options={[
				{ name: 'test', label: 'test' },
				{ name: 'test2', label: 'test2' },
			]}
			name="professional"
			id="professional"
		/>
		{#if error}
			<Alert type="error" size="sm">Impossible de modifier l'orientation</Alert>
		{/if}
		<div class="flex flex-row gap-6 mt-12">
			<Button type="submit">Valider</Button>
			<Button outline on:click={close}>Annuler</Button>
		</div>
	</form>
</section>
