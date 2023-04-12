<script lang="ts">
	import { token } from '$lib/stores';
	import { pluralize } from '$lib/helpers';

	import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';
	import Alert from '../base/Alert.svelte';
	import { postApiFormData } from '$lib/utils/post';
	let resultPromise;

	function handleFilesSelect(event: CustomEvent<{ acceptedFiles: FileList }>): void {
		const file = event.detail.acceptedFiles[0];
		const formData = new FormData();
		formData.append('upload_file', file);
		resultPromise = postApiFormData(`/v1/beneficiaries/update-from-caf-msa`, formData, {
			'jwt-token': $token,
		});
	}
</script>

<div class="flex flex-col gap-6">
	{#if resultPromise === undefined}
		<div>
			Fichier de flux (mensuel ou quotidien) fourni par la caf ou la MSA.
			<br />
		</div>
		<Dropzone on:drop={handleFilesSelect} multiple={false} accept=".xml" inputElement={undefined}>
			Déposez votre fichier ou cliquez pour le rechercher sur votre ordinateur.
		</Dropzone>
	{:else}
		{#await resultPromise}
			<Alert type="info" title={`Importation en cours...`} />
		{:then results}
			<Alert
				type={results.nb_success ? 'success' : 'error'}
				title={`${results.nb_success || 'Aucun'}
					${pluralize('dossier', results.nb_success)}
					mis à jour
					sur ${results.nb_file}.`}
			/>
		{:catch error}
			<Alert type="error" title="import du fichier impossible, veuillez contacter le support." />
			<details>
				<summary>voir le detail</summary>
				<pre>{error.message}</pre>
			</details>
		{/await}
	{/if}
</div>
