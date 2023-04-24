<script lang="ts">
	import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';
	import { Button, Checkbox, GroupCheckbox, Spinner } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import { Alert } from '$lib/ui/base';
	import { v4 as uuidv4 } from 'uuid';
	import { pluralize } from '$lib/helpers';
	import { postApiFormData, postApiJson } from '$lib/utils/post';
	import { translateError } from './errorMessage';

	let sendAccountEmail = false;
	let parsePromise: Promise<StructureCsvResponse[]>;
	let insertPromise: Promise<StructureCsvResponse[]>;
	let structurestoImport = [];

	type StructureCsvResponse = {
		data: unknown;
		errors: CsvError[];
		row: unknown;
		valid: boolean;
		uuid: string;
	};
	type CsvError = {
		key: string | null;
		error: string;
	};

	async function convertCsvFile(formData: FormData): Promise<StructureCsvResponse[]> {
		const structures = await postApiFormData<StructureCsvResponse[]>(
			'/v1/convert-file/structures',
			formData
		);

		return structures.map((structure) => {
			if (structure.valid) {
				const uuid = uuidv4();
				structurestoImport.push(uuid);
				return { uuid, ...structure };
			}
			return { ...structure };
		});
	}

	async function handleFilesSelect(event: CustomEvent<{ acceptedFiles: FileList }>): Promise<void> {
		const file = event.detail.acceptedFiles[0];
		const formData = new FormData();
		formData.append('upload_file', file);
		parsePromise = convertCsvFile(formData);
	}

	async function handleSubmit(structures: StructureCsvResponse[]) {
		const payload = JSON.stringify({
			sendAccountEmail,
			structures: structures.flatMap(({ uuid, data }) =>
				structurestoImport.includes(uuid) ? data : []
			),
		});
		insertPromise = postApiJson<StructureCsvResponse[]>('/v1/structures/import', payload);
	}

	function backToFileSelect() {
		structurestoImport = [];
		parsePromise = undefined;
		insertPromise = undefined;
	}

	const headers = [
		{ label: 'Nom', csvName: 'Nom', mandatory: true },
		{ label: 'Description', csvName: 'Description', mandatory: false },
		{ label: 'Téléphones', csvName: 'Téléphones', mandatory: false },
		{ label: 'Adresse', csvName: 'Adresse', mandatory: false },
		{ label: 'Adresse (complément)', csvName: 'Adresse (complément)', mandatory: false },
		{ label: 'Code postal', csvName: 'Code postal', mandatory: true },
		{ label: 'Ville', csvName: 'Ville', mandatory: true },
		{ label: 'Site web', csvName: 'Site web', mandatory: false },
		{ label: 'Courriel', csvName: 'Courriel', mandatory: false },
		{ label: 'Siret', csvName: 'Siret', mandatory: false },
		{ label: 'Courriel responsable', csvName: 'Courriel responsable', mandatory: true },
		{ label: 'Prénom', csvName: 'Prénom responsable', mandatory: false },
		{ label: 'Nom', csvName: 'Nom responsable', mandatory: false },
		{ label: 'Fonction', csvName: 'Fonction responsable', mandatory: false },
		{ label: 'Numéros de téléphone', csvName: 'Téléphones responsable', mandatory: false },
	];
</script>

<div class="flex flex-col gap-6">
	{#if insertPromise === undefined}
		{#if parsePromise === undefined}
			<div>
				Veuillez fournir un fichier au format EXCEL ou CSV.
				<br />Vous pouvez
				<a href="/fichiers/import_structures.csv" download>télécharger un modèle</a>
				et
				<a href="https://pad.incubateur.net/s/y-ZW1qQOw#" target="_blank" rel="noopener noreferrer"
					>consulter la notice de remplissage</a
				>.
			</div>
			<Dropzone
				on:drop={handleFilesSelect}
				multiple={false}
				accept=".csv,.xls,.xlsx"
				inputElement={undefined}
			>
				Déposez votre fichier ou cliquez pour le rechercher sur votre ordinateur.
			</Dropzone>
		{:else}
			{#await parsePromise}
				<Spinner label="Lecture du fichier en cours..." />
			{:then parsedStructures}
				<p>
					Vous allez importer les structures suivantes. Veuillez vérifier que les données sont
					correctes et confirmer.
				</p>
				<table class="w-full divide-y divide-gray-300">
					<caption class="sr-only">Récapitulatif des structures à importer</caption>
					<thead class="px-2 py-2">
						<th />
						{#each headers as { label }}
							<th>{label}</th>
						{/each}
					</thead>
					<tbody class="bg-white divide-y divide-gray-300">
						{#each parsedStructures as structure}
							{@const lineErrors = Object.fromEntries(
								structure.errors?.map(({ key, error }) => [key, error]) || []
							)}
							<tr>
								<td class="align-middle">
									{#if structure.valid}
										<GroupCheckbox
											classNames="bottom-3 left-2"
											bind:selectedOptions={structurestoImport}
											groupId="structure_import"
											option={{ name: structure.uuid, label: '' }}
											title={`${
												structurestoImport.includes(structure.uuid) ? 'Ne pas importer' : 'Importer'
											} la structure ${structure.data['Nom']}`}
										/>
									{:else}
										<i
											class="ri-alert-line text-error relative left-3"
											title="La structure contient des champs invalides"
										/>
									{/if}
								</td>
								{#each headers as { csvName }}
									<td class="px-2 py-2">
										{#if structure.valid}
											<Text value={structure.data[csvName]} defaultValue="" />
										{:else if lineErrors[csvName]}
											<Text
												value={structure.row[csvName]}
												defaultValue=""
												class="text-error border-dashed border-b-1"
												title={translateError(lineErrors[csvName])}
											/>
										{:else}
											<Text value={structure.row[csvName]} defaultValue="" />
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
				<Checkbox
					name="sendAccountEmail"
					label="Envoyer un email de creation de compte aux nouveaux gestionnaires de structure"
					bind:checked={sendAccountEmail}
				/>
				<div class="mt-6 flex justify-end flex-row gap-4">
					<span>
						{structurestoImport.length || 'Aucun'}
						{pluralize('structure', structurestoImport.length)}
						{pluralize('sélectionnée', structurestoImport.length)}
						sur {parsedStructures.length}
					</span>
				</div>
				<div class="mt-6 flex justify-end flex-row gap-4">
					<Button on:click={backToFileSelect} outline={true}>Retour</Button>
					<Button
						on:click={() => handleSubmit(parsedStructures)}
						disabled={structurestoImport.length < 1}
					>
						Confirmer
					</Button>
				</div>
			{:catch error}
				<Alert type="error" title="lecture du fichier impossible, veuillez contacter le support." />
				<Button on:click={backToFileSelect} outline={true}>Retour</Button>
				<details>
					<summary>voir le detail</summary>
					<pre>{error.message}</pre>
				</details>
			{/await}
		{/if}
	{:else}
		{#await insertPromise}
			<Spinner
				label={`Import ${pluralize('de la', structurestoImport.length, 'des')} ${pluralize(
					'structure',
					structurestoImport.length
				)} en cours...`}
			/>
		{:then insertResults}
			{@const nbStructureInserted = insertResults.filter(({ valid }) => valid).length}

			<Alert
				type={nbStructureInserted ? 'success' : 'error'}
				title={`${nbStructureInserted || 'Aucun'}
					${pluralize('structure', nbStructureInserted)}
					${pluralize('importée', nbStructureInserted)}
					sur ${insertResults.length}.`}
			/>
			<table class="w-full divide-y divide-gray-300">
				<caption class="sr-only">Récapitulatif des structures créées</caption>
				<thead class="px-2 py-2">
					<th class="text-left">Nom</th>
					<th class="text-left">Email du Responsable</th>
					<th />
				</thead>
				<tbody class="bg-white divide-y divide-gray-300">
					{#each insertResults as structure}
						{@const lineErrors = structure.errors?.map(({ error }) => error) || []}
						<tr>
							<td class="px-2 py-2">
								{#if structure.valid}
									<Text value={structure.data['Nom']} />
								{:else}
									<Text value={structure.row['Nom']} />
								{/if}
							</td>
							<td class="px-2 py-2">
								{#if structure.valid}
									<Text value={structure.data['Courriel responsable']} />
								{:else}
									<Text value={structure.row['Courriel responsable']} />
								{/if}
							</td>
							<td class="px-2 py-2">
								{#if structure.valid === false}
									<Text classNames="text-error" value={translateError(lineErrors.join(','))} />
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
			<Alert type="error" title="import des structure impossible, veuillez contacter le support." />
			<Button on:click={backToFileSelect} outline={true}>Retour</Button>
			<details>
				<summary>voir le detail</summary>
				<pre>{error.message}</pre>
			</details>
		{/await}
	{/if}
</div>
