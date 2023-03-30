<script lang="ts">
	import { token } from '$lib/stores';
	import { pluralize } from '$lib/helpers';

	import Dropzone from 'svelte-file-dropzone';
	import Alert from '../base/Alert.svelte';
	import Text from '../utils/Text.svelte';
	import { postApiFormData } from '$lib/utils/post';
	let resultPromise;

	function handleFilesSelect(event: CustomEvent<{ acceptedFiles: FileList }>): void {
		const file = event.detail.acceptedFiles[0];
		const formData = new FormData();
		formData.append('upload_file', file);
		resultPromise = postApiFormData(`/v1/uploads/orientation_manager`, formData, {
			'jwt-token': $token,
		});
	}

	export function translateError(error = ''): string {
		if (/duplicate key/i.test(error)) {
			return `Un chargé d'orientation avec ce courriel existe déjà.`;
		}
		if (/none is not an allowed value/.test(error)) {
			return `Champ obligatoire manquant`;
		}
		if (/not a valid email address/.test(error)) {
			return `Format d'adresse mail invalide`;
		}
		console.error(error);
		return `Une erreur s'est produite lors de l'importation.`;
	}
</script>

<div class="flex flex-col gap-6">
	{#if resultPromise === undefined}
		<div>
			Veuillez fournir un fichier au format EXCEL(format: xlsx ou xls) ou CSV.
			<br />Vous pouvez
			<a href="/fichiers/import_charges_orientation.xlsx" download>télécharger un modèle</a>
			et
			<a href="https://pad.incubateur.net/s/EchGdpy8h#" target="_blank" rel="noopener noreferrer"
				>consulter la notice de remplissage</a
			>.
		</div>
		<Dropzone on:drop={handleFilesSelect} multiple={false} accept=".csv,.xls,.xlsx">
			Déposez votre fichier ou cliquez pour le rechercher sur votre ordinateur.
		</Dropzone>
	{:else}
		{#await resultPromise}
			<Alert type="info" title={`Importation en cours...`} />
		{:then orientation_managers}
			{@const successfulInserts = orientation_managers.filter(({ valid }) => valid).length}

			<Alert
				type={successfulInserts ? 'success' : 'error'}
				title={`${successfulInserts || 'Aucun'}
					${pluralize('chargé', successfulInserts)}
					d'orientation
					${pluralize('importé', successfulInserts)}
					sur ${orientation_managers.length}.`}
			/>

			<table class="fr-table fr-table--layout-fixed w-full">
				<caption class="sr-only">Récapitulatif des imports</caption>
				<thead class="px-2 py-2">
					<th class="text-left px-2 py-2">Courriel*</th>
					<th class="text-left px-2 py-2">Prénom</th>
					<th class="text-left px-2 py-2">Nom</th>
					<th />
				</thead>
				<tbody class="bg-white divide-y divide-gray-300">
					{#each orientation_managers as orientation_manager}
						<tr>
							<td class="px-2 py-2">
								<Text value={orientation_manager.email} />
							</td>
							<td class="px-2 py-2">
								<Text value={orientation_manager.lastname} defaultValue="" />
							</td>
							<td class="px-2 py-2">
								<Text value={orientation_manager.firstname} defaultValue="" />
							</td>

							<td class="px-2 py-2">
								{#if orientation_manager.valid === false}
									<Text classNames="text-error" value={translateError(orientation_manager.error)} />
								{:else}
									<span
										class="fr-icon-success-fill text-success"
										aria-hidden="true"
										style="margin: 0 50%;"
									/>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:catch error}
			<Alert type="error" title="import du fichier impossible, veuillez contacter le support." />
			<details>
				<summary>voir le detail</summary>
				<pre>{error.message}</pre>
			</details>
		{/await}
	{/if}
</div>
