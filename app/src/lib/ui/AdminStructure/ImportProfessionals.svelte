<script lang="ts">
	import Dropzone from 'svelte-file-dropzone';
	import { ImportParserError, Text } from '$lib/ui/utils';
	import { Alert, Button, GroupCheckbox as Checkbox } from '$lib/ui/base';
	import { post } from '$lib/utils/post';
	import type { ProAccountInput } from '../ProCreationForm/pro.schema';
	import { pluralize } from '$lib/helpers';
	import { parseEntities } from '$lib/utils/importFileParser';

	type ProImport = ProAccountInput & {
		valid: boolean;
		uid: string;
	};
	export let structureId: string;

	let files = [];
	let pros: ProImport[] = [];

	$: prosToImport = pros.filter(({ uid }) => uidToImport.includes(uid));

	let uidToImport = [];
	let parseErrors = [];

	function handleFilesSelect(event: CustomEvent<{ acceptedFiles: Buffer[] }>): void {
		files = event.detail.acceptedFiles;
		for (let i = 0; i < files.length; i++) {
			parseEntities(
				files[i],
				'ProImport',
				headers,
				({ entities, idToImport }: Record<string, unknown>, errors: string[]): void => {
					pros = entities as ProImport[];
					uidToImport = idToImport as string[];
					parseErrors = errors;
				}
			);
		}
	}

	let insertInProgress = false;
	let insertResults: { pro: ProAccountInput; error: string | null }[];

	async function handleSubmit() {
		insertInProgress = true;
		insertResults = [];
		for (const proToImport of prosToImport) {
			const { uid, valid, ...pro } = proToImport;
			let error: string;
			try {
				await post('/inscription/request', {
					accountRequest: pro,
					structureId,
					autoConfirm: true,
				});
			} catch (e) {
				error = e.message;
			}
			insertResults = [...insertResults, { pro, error }];
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
		parseErrors = [];
	}

	$: successfulImports = (insertResults || []).filter(({ error }) => !error).length;
</script>

<div class="flex flex-col gap-6">
	{#if insertResults === undefined}
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
											bind:selectedOptions={uidToImport}
											groupId={'toImport'}
											option={{ name: pro.uid, label: '' }}
											disabled={!pro.valid}
											title={`${
												uidToImport.includes(pro.uid) ? 'Ne pas importer' : 'Importer'
											} le professionnel`}
										/>
									{:else}
										<i
											class="ri-alert-line text-error relative left-4"
											title="Le professionnel ne contient pas les informations obligatoires (marquées d'un astérisque)"
										/>
									{/if}
								</td>
								<td class="px-2 py-2">
									<Text value={pro.email} />
								</td>
								<td class="px-2 py-2">
									<Text value={pro.firstname} />
								</td>
								<td class="px-2 py-2">
									<Text value={pro.lastname} />
								</td>
								<td class="px-2 py-2">
									<Text value={pro.mobileNumber} defaultValue="" />
								</td>
								<td class="px-2 py-2">
									<Text value={pro.position} defaultValue="" />
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<ImportParserError {parseErrors} />
			<div class="mt-6 flex justify-end flex-row gap-4">
				<span>
					{uidToImport.length || 'Aucun'}
					{pluralize('professionnel', uidToImport.length)}
					{pluralize('sélectionné', uidToImport.length)}
					sur {pros.length}
				</span>
			</div>
			<div class="mt-6 flex justify-end flex-row gap-4">
				<Button on:click={backToFileSelect} outline={true}>Retour</Button>
				<Button on:click={handleSubmit} disabled={uidToImport.length < 1 || !structureId}
					>Confirmer
				</Button>
			</div>
		{:else}
			<div>
				Veuillez fournir un fichier au format EXCEL ou CSV.
				<br />Vous pouvez
				<a href="/fichiers/import_professionnels.csv" download>télécharger un modèle</a>
				et
				<a href="https://pad.incubateur.net/s/oQ_2Zj9jT#" target="_blank" rel="noopener noreferrer"
					>consulter la notice de remplissage</a
				>.
			</div>
			<Dropzone on:drop={handleFilesSelect} multiple={false} accept=".csv,.xls,.xlsx">
				Déposez votre fichier ou cliquez pour le rechercher sur votre ordinateur.
			</Dropzone>
			<ImportParserError {parseErrors} />
		{/if}
	{:else}
		<div class="flex flex-col gap-4">
			{#if insertInProgress}
				<Alert
					type="info"
					title={`Ajout ${pluralize("d'un", uidToImport.length, 'des')} ${pluralize(
						'professionnel',
						uidToImport.length
					)} en cours...`}
				/>
			{:else}
				<Alert
					type={successfulImports ? 'success' : 'error'}
					title={`${successfulImports || 'Aucun'}
					${pluralize('professionnel', successfulImports)}
					${pluralize('importé', successfulImports)}
					sur ${uidToImport.length}
					${pluralize('demandé', uidToImport.length)}`}
				/>
			{/if}
			{#key insertResults}
				<div class="border-b border-gray-200 shadow">
					<table class="w-full divide-y divide-gray-300">
						<thead class="px-2 py-2">
							<th>Courriel</th>
							<th>Prénom</th>
							<th>Nom</th>
						</thead>
						<tbody class="bg-white divide-y divide-gray-300">
							{#each insertResults as insertResult}
								<tr>
									<td class="px-2 py-2">
										<Text value={insertResult.pro.email} />
									</td>
									<td class="px-2 py-2">
										<Text value={insertResult.pro.firstname} />
									</td>
									<td class="px-2 py-2">
										<Text value={insertResult.pro.lastname} />
									</td>
									<td class="px-2 py-2">
										{#if insertResult.error}
											<Text
												classNames="text-error"
												value={`Une erreur s'est produite, le professionnel n'a pas été importé. (${insertResult.error})`}
											/>
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
