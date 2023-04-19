<script lang="ts">
	import { token } from '$lib/stores';

	import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';
	import Alert from '../base/Alert.svelte';
	import { postApiFormData } from '$lib/utils/post';
	import Spinner from '../base/Spinner.svelte';
	let resultPromise;

	function handleFilesSelect(event: CustomEvent<{ acceptedFiles: FileList }>): void {
		const file = event.detail.acceptedFiles[0];
		const formData = new FormData();
		formData.append('upload_file', file);
		resultPromise = postApiFormData('/v1/beneficiaries/update-from-caf-msa', formData, {
			'jwt-token': $token,
		});
	}
</script>

<div class="flex flex-col gap-6">
	{#if resultPromise === undefined}
		<div>
			Fichier de flux (mensuel ou quotidien) fourni par la CAF ou la MSA.
			<br />
		</div>
		<Dropzone on:drop={handleFilesSelect} multiple={false} accept=".xml" inputElement={undefined}>
			Déposez votre fichier ou cliquez pour le rechercher sur votre ordinateur.
		</Dropzone>
	{:else}
		{#await resultPromise}
			<Spinner label="Envoi du fichier en cours..." />
		{:then _}
			<Alert
				type="success"
				title="Envoi du fichier terminé."
				description="Le traitement du fichier est en cours, vous recevrez un mail un fois le traitement terminé."
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
