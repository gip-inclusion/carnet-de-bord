<script lang="ts">
	import Svelecte from 'svelecte';
	import Dropzone from 'svelte-file-dropzone';
	import { v4 as uuidv4 } from 'uuid';
	import Checkbox from '$lib/ui/base/GroupCheckbox.svelte';
	import { Text } from '$lib/ui/utils';
	import { Alert, Button } from '$lib/ui/base';
	import { post } from '$lib/utils/post';
	import { GetStructuresForDeploymentDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { GetStructuresForDeploymentQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, OperationStore, query } from '@urql/svelte';
	import { parse as csvParse } from 'csv-parse/browser/esm/sync';

	export let deploymentId: string;

	let queryStructures: OperationStore<GetStructuresForDeploymentQuery> = operationStore(
		GetStructuresForDeploymentDocument,
		{
			deploymentId,
		}
	);
	query(queryStructures);

	type Pro = {
		email: string;
		firstname: string;
		lastname: string;
		mobileNumber?: string;
		position?: string;
	};

	type ProImport = Pro & {
		valid: boolean;
		uid: string;
	};

	$: structures = $queryStructures.data?.structure || [];
	let structureId: string;

	let files = [];
	let pros: ProImport[] = [];

	$: prosToImport = pros.filter(({ uid }) => toImport.includes(uid));

	function validate(pro: null | undefined | Record<string, any>): boolean {
		return !!pro && !!pro.email && !!pro.firstname && !!pro.lastname;
	}

	let toImport = [];

	function handleFilesSelect(event: CustomEvent<{ acceptedFiles: Buffer[] }>): void {
		files = event.detail.acceptedFiles;
		for (let i = 0; i < files.length; i++) {
			const reader = new FileReader();
			reader.onload = () => {
				const binaryStr = reader.result;
				pros = csvParse(binaryStr.toString(), {
					from: 2,
					columns: headers.map(({ key }) => key),
					trim: true,
					skip_empty_lines: true,
				})
					.reduce(
						([valid, invalid]: [ProImport[], ProImport[]], cur: Record<string, any>) => {
							cur.uid = uuidv4();
							cur.valid = validate(cur);
							if (cur.valid) {
								valid.push(cur as ProImport);
							} else {
								invalid.push(cur as ProImport);
							}
							return [valid, invalid];
						},
						[[], []]
					)
					.reduce((acc: ProImport[], cur: ProImport[]) => {
						return [...acc, ...cur];
					}, []);
				toImport = pros.filter(({ valid }) => valid).map(({ uid }) => uid);
			};
			reader.readAsText(files[i]);
		}
	}

	let insertInProgress = false;
	let insertResult: { pro_: Pro; error: string | null }[];

	async function handleSubmit() {
		insertInProgress = true;
		insertResult = [];
		for (const pro of prosToImport) {
			const { uid, valid, ...pro_ } = pro;
			let error: string;
			try {
				const response = await post('/inscription/request', {
					accountRequest: pro_,
					structureId,
					autoConfirm: true,
				});

				if (!response.ok) {
					error = await response.json();
				}
			} catch (e) {
				error = e;
			}
			insertResult = [...insertResult, { pro_, error }];
		}
		insertInProgress = false;
	}

	const headers = [
		{ label: 'Courriel*', key: 'email' },
		{ label: 'Prénom*', key: 'firstname' },
		{ label: 'Nom*', key: 'lastname' },
		{ label: 'Téléphone', key: 'mobileNumber' },
		{ label: 'Fonction', key: 'position' },
	];

	function backToFileSelect() {
		pros = [];
	}

	$: successfulImports = (insertResult || []).filter(({ error }) => !error).length;
</script>

<div class="flex flex-col gap-6">
	{#if insertResult === undefined}
		<div class="flex flex-row gap-4">
			<div class="flex items-center">
				<label class="mb-2 fr-label" for="structureSelect">
					<div>Choisissez la structure de rattachement</div>
				</label>
			</div>
			<div class="flex items-center !grow-0 w-1/2">
				<Svelecte
					name="structureSelect"
					options={structures}
					placeholder=""
					bind:value={structureId}
					disableSifter={false}
					class="svelecte-control custom-svelecte"
					valueField="id"
					labelField="name"
					clearable={true}
				/>
			</div>
		</div>
		{#if pros.length > 0}
			<p>
				Vous allez importer les professionnels suivants. Veuillez vérifier que les données sont
				correctes et confirmer.
			</p>
			<div class="border-b border-gray-200 shadow">
				<table class="w-full divide-y divide-gray-300">
					<thead class="px-2 py-2">
						<th />
						<th>Courriel*</th>
						<th>Prénom*</th>
						<th>Nom*</th>
						<th>Téléphone</th>
						<th>Fonction</th>
					</thead>
					<tbody class="bg-white divide-y divide-gray-300" style="overflow-x: auto;">
						{#each pros as pro}
							<tr>
								<td class="align-middle">
									{#if pro.valid}
										<Checkbox
											classNames="bottom-3 left-3"
											bind:selectedOptions={toImport}
											groupId={'toImport'}
											option={{ name: pro.uid, label: '' }}
											disabled={!pro.valid}
											title={`${
												toImport.includes(pro.uid) ? 'Ne pas importer' : 'Importer'
											} le professionnel`}
										/>
									{:else}
										<i
											class="ri-alert-line text-error relative left-4"
											title="Le professionnel ne contient pas les informations obligatoires (marquées d'un astérisque)"
										/>
									{/if}
								</td>
								<td class="px-2 py-2"><Text value={pro.email} /></td>
								<td class="px-2 py-2"><Text value={pro.firstname} /></td>
								<td class="px-2 py-2"><Text value={pro.lastname} /></td>
								<td class="px-2 py-2"><Text value={pro.mobileNumber} /></td>
								<td class="px-2 py-2"><Text value={pro.position} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="mt-6 flex justify-end flex-row gap-4">
				<span>
					{toImport.length || 'Aucun'}
					professionnel{toImport.length > 1 ? 's' : ''}
					sélectionné{toImport.length > 1 ? 's' : ''}
					sur {pros.length}
				</span>
			</div>
			<div class="mt-6 flex justify-end flex-row gap-4">
				<Button on:click={backToFileSelect} outline={true}>Retour</Button>
				<Button on:click={handleSubmit} disabled={toImport.length < 1 || !structureId}
					>Confirmer</Button
				>
			</div>
		{:else}
			<div>
				Veuillez fournir un fichier au format CSV avec les informations suivantes dans l'ordre,
				séparées par des virgules (deux virgules consécutives quand il n'y a pas de valeur)&nbsp;:
				<br /><strong>{headers.map((header) => header.label).join(', ')}</strong>
			</div>
			<Dropzone on:drop={handleFilesSelect} multiple={false} accept=".csv">
				Déposez votre fichier ou cliquez pour le rechercher sur votre ordinateur.
			</Dropzone>
		{/if}
	{:else}
		<div class="flex flex-col gap-4">
			{#if insertInProgress}
				<Alert
					type="info"
					title={`Ajout ${toImport.length > 1 ? 'des' : ' d’un'} professionnel${
						toImport.length > 1 ? 's' : ''
					} en cours...`}
				/>
			{:else}
				<Alert
					type={successfulImports ? 'success' : 'error'}
					title={`${successfulImports || 'Aucun'}
					professionnel${successfulImports > 1 ? 's' : ''}
					importé${successfulImports > 1 ? 's' : ''}
					sur ${toImport.length}
					demandé${toImport.length > 1 ? 's' : ''}.`}
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
							{#each insertResult as pro}
								<tr>
									<td class="px-2 py-2 ">
										<Text value={pro.pro_.email} />
									</td>
									<td class="px-2 py-2 ">
										<Text value={pro.pro_.firstname} />
									</td>
									<td class="px-2 py-2 ">
										<Text value={pro.pro_.lastname} />
									</td>
									<td class="px-2 py-2 ">
										{#if pro.error}
											<Text
												classNames="text-error"
												value={"Une erreur s'est produite, le professionnel n'a pas été importé."}
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
