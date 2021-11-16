<script context="module" lang="ts">
	import {
		InsertStructureDocument,
		InsertStructureMutation,
		InsertStructureMutationVariables,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, mutation } from '@urql/svelte';
	import type { OperationStore } from '@urql/svelte';
</script>

<script lang="ts">
	import Dropzone from 'svelte-file-dropzone';
	import Checkbox from '$lib/ui/base/GroupCheckbox.svelte';
	import { Text } from '$lib/ui/utils';
	import { v4 as uuidv4 } from 'uuid';
	import { Alert, Button } from '$lib/ui/base';

	type Structure = {
		name: string;
		phone: string;
		email: string;
		address1: string;
		address2: string;
		postalCode: string;
		city: string;
		website: string;
		siret: string;
		shortDesc: string;
	};

	type StructureImport = Structure & {
		valid: boolean;
		uid: string;
	};

	export let deploymentId: string;

	let files = [];
	let structures: StructureImport[] = [];

	$: structuresToImport = structures.filter(({ uid }) => toImport.includes(uid));

	function validate(struct: unknown): struct is StructureImport {
		return !!struct && !!(struct as Structure).name && !!(struct as Structure).city;
	}

	function processRawCSV(data: string): StructureImport[] {
		const output = [];
		const rows = data.split('\n');
		for (let i = 0; i < rows.length; i++) {
			if (rows[i].replace(/\s/, '')) {
				const cells = rows[i].split(',');
				const structure = { uid: uuidv4() } as StructureImport;
				for (let j = 0; j < headers.length; j++) {
					structure[headers[j].key] = cells[j];
				}
				structure.valid = validate(structure);
				output.push(structure);
			}
		}
		return output;
	}

	let toImport = [];

	function handleFilesSelect(e: { detail: { acceptedFiles: Buffer[] } }): void {
		files = e.detail.acceptedFiles;
		for (let i = 0; i < files.length; i++) {
			const reader = new FileReader();
			reader.onload = () => {
				const binaryStr = reader.result;
				structures = processRawCSV(binaryStr.toString())
					.reduce(
						([valid, invalid], cur) => {
							if (cur.valid) {
								valid.push(cur);
							} else {
								invalid.push(cur);
							}
							return [valid, invalid];
						},
						<[StructureImport[], StructureImport[]]>[[], []]
					)
					.reduce((acc, cur) => {
						return [...acc, ...cur];
					}, []);

				toImport = structures.filter(({ valid }) => valid).map(({ uid }) => uid);
			};
			reader.readAsText(files[i]);
		}
	}

	const insertStore: OperationStore<
		InsertStructureMutation,
		InsertStructureMutationVariables,
		Structure
	> = operationStore(InsertStructureDocument);
	const inserter = mutation(insertStore);
	let insertInProgress = false;
	let insertResult: { struct: Structure; error: string | null }[];

	async function handleSubmit() {
		insertInProgress = true;
		insertResult = [];
		for (const structure of structuresToImport) {
			const { uid, valid, ...struct } = structure;
			await inserter({ ...struct, deploymentId });
			await new Promise((resolve) => {
				setTimeout(resolve, 500);
			});
			insertResult = [
				...insertResult,
				{ struct, error: insertStore.error ? insertStore.error.toString() : null },
			];
		}
		insertInProgress = false;
	}

	const headers = [
		{ label: 'Nom*', key: 'name' },
		{ label: 'Ville*', key: 'city' },
		{ label: 'Code postal', key: 'postalCode' },
		{ label: 'Adresse', key: 'address1' },
		{ label: 'Adresse (complément)', key: 'address2' },
		{ label: 'Téléphone', key: 'phone' },
		{ label: 'Courriel', key: 'email' },
		{ label: 'Site web', key: 'website' },
		{ label: 'SIRET', key: 'siret' },
		{ label: 'Description', key: 'shortDesc' },
	];

	function backToFileSelect() {
		structures = [];
	}

	$: successfulImports = (insertResult || []).filter(({ error }) => !error).length;
</script>

<div>
	{#if insertResult === undefined}
		{#if structures.length > 0}
			<p>
				Vous allez importer les structures suivantes. Veuillez vérifier que les données sont
				correctes et confirmer.
			</p>
			<div class="border-b border-gray-200 shadow">
				<table class="w-full divide-y divide-gray-300">
					<thead class="px-2 py-2">
						<th>Nom*</th>
						<th>Ville*</th>
						<th>Code postal</th>
						<th>Adresse</th>
						<th>Adresse (complément)</th>
						<th>Téléphone</th>
						<th>Courriel</th>
						<th>Site web</th>
						<th>SIRET</th>
						<th>Description</th>
					</thead>
					<tbody class="bg-white divide-y divide-gray-300">
						{#each structures as structure}
							<tr>
								<td class="px-2 py-2"><Text value={structure.name} /></td>
								<td class="px-2 py-2"><Text value={structure.city} /></td>
								<td class="px-2 py-2"><Text value={structure.postalCode} /></td>
								<td class="px-2 py-2"><Text value={structure.address1} /></td>
								<td class="px-2 py-2"><Text value={structure.address2} /></td>
								<td class="px-2 py-2"><Text value={structure.phone} /></td>
								<td class="px-2 py-2"><Text value={structure.email} /></td>
								<td class="px-2 py-2"><Text value={structure.website} /></td>
								<td class="px-2 py-2"><Text value={structure.siret} /></td>
								<td class="px-2 py-2"><Text value={structure.shortDesc} /></td>
								<td class="align-middle">
									{#if structure.valid}
										<Checkbox
											classNames="bottom-3 right-3"
											bind:selectedOptions={toImport}
											groupId={'toImport'}
											option={{ name: structure.uid, label: '' }}
											disabled={!structure.valid}
											title={`${
												toImport.includes(structure.uid) ? 'Ne pas importer' : 'Importer'
											} la structure`}
										/>
									{:else}
										<i
											class="ri-alert-line text-error relative right-2"
											title="La structure ne contient pas les informations obligatoires (marquées d'un astérisque)"
										/>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="mt-6 flex justify-end flex-row gap-4">
				<span>
					{toImport.length || 'Aucune'}
					structure{toImport.length > 1 ? 's' : ''}
					sélectionnée{toImport.length > 1 ? 's' : ''}
					sur {structures.length}
				</span>
			</div>
			<div class="mt-6 flex justify-end flex-row gap-4">
				<Button on:click={backToFileSelect} outline={true}>Retour</Button>
				<Button on:click={handleSubmit} disabled={toImport.length < 1}>Confirmer</Button>
			</div>
		{:else}
			<p>
				Veuillez fournir un fichier au format CSV avec les informations suivantes dans l'ordre,
				séparées par des virgules (deux virgules consécutives quand il n'y a pas de valeur)&nbsp;:
				<br />{headers.map((header) => header.label).join(', ')}
			</p>
			<Dropzone on:drop={handleFilesSelect} multiple={false} accept=".csv">
				Déposez votre fichier ou cliquez pour le rechercher sur votre ordinateur.
			</Dropzone>
		{/if}
	{:else}
		<div class="flex flex-col gap-4">
			{#if insertInProgress}
				<Alert
					type="info"
					title={`Ajout de${toImport.length > 1 ? 's' : ' la'} structure${
						toImport.length > 1 ? 's' : ''
					} en cours...`}
				/>
			{:else}
				<Alert
					type={successfulImports ? 'success' : 'error'}
					title={`${successfulImports || 'Aucune'}
					structure${successfulImports > 1 ? 's' : ''}
					importée${successfulImports > 1 ? 's' : ''}
					sur ${toImport.length}
					demandée${toImport.length > 1 ? 's' : ''}.`}
				/>
			{/if}
			{#key insertResult}
				<div class="border-b border-gray-200 shadow">
					<table class="w-full divide-y divide-gray-300">
						<thead class="px-2 py-2">
							<th>Nom</th>
							<th>Ville</th>
							<th>Résultat</th>
						</thead>
						<tbody class="bg-white divide-y divide-gray-300">
							{#each insertResult as structure}
								<tr>
									<td class="px-2 py-2 ">
										<Text value={structure.struct.name} />
									</td>
									<td class="px-2 py-2 ">
										<Text value={structure.struct.city} />
									</td>
									<td class="px-2 py-2 ">
										{#if structure.error}
											<Text
												classNames="text-error"
												value={"Une erreur s'est produite, la structure n'a pas été importée."}
											/>
										{:else}
											<span
												class="fr-fi-checkbox-circle-fill text-success"
												aria-hidden="true"
												style="margin: 0 50%;"
											/>
										{/if}
									</td>
								</tr>
							{/each}
							{#if insertInProgress}
								<tr>
									<td colspan="3">
										<i class="ri-loader-2-fill" style="margin: 0 50%;" />
									</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
			{/key}
		</div>
	{/if}
</div>
