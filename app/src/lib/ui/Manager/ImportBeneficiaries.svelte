<script lang="ts">
	import { token } from '$lib/stores';
	import {
		GetProfessionalsForManagerDocument,
		GetStructuresForManagerDocument,
		type Professional,
		type Structure,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type {
		GetProfessionalsForManagerQuery,
		GetStructuresForManagerQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { type OperationStore, operationStore, query } from '@urql/svelte';
	import Dropzone from 'svelte-file-dropzone';
	import { GroupCheckbox as Checkbox } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import { Alert, Button } from '$lib/ui/base';
	import { displayFullName } from '$lib/ui/format';
	import { pluralize } from '$lib/helpers';
	import { formatDateLocale } from '$lib/utils/date';
	import { v4 as uuidv4 } from 'uuid';
	import { postApiFormData, postApiJson } from '$lib/utils/post';
	import { translateError } from './errorMessage';
	import { Spinner } from '$lib/ui/base';

	let queryProfessionals: OperationStore<GetProfessionalsForManagerQuery> = operationStore(
		GetProfessionalsForManagerDocument,
		{}
	);
	query(queryProfessionals);

	let queryStructures: OperationStore<GetStructuresForManagerQuery> = operationStore(
		GetStructuresForManagerDocument,
		{}
	);
	query(queryStructures);

	type CSVHeaders =
		| 'Identifiant dans le SI*'
		| 'Prénom*'
		| 'Nom*'
		| 'Date de naissance*'
		| 'NIR'
		| 'Lieu de naissance'
		| 'Téléphone'
		| 'Email'
		| 'Adresse'
		| 'Adresse (complément'
		| 'Code postal'
		| 'Ville'
		| 'Situation'
		| 'Numéro allocataire CAF/MSA'
		| 'Identifiant Pôle Emploi'
		| 'Droits RSA'
		| 'Droits ARE'
		| 'Droits ASS'
		| "Prime d'activité"
		| 'Droits RQTH'
		| 'Zone de mobilité'
		| 'Emploi recherché '
		| 'Niveau de formation'
		| 'Structure'
		| 'Accompagnateurs';

	type BeneficiaryCsvResponse = {
		data: Record<CSVHeaders, string>;
		errors: CsvError[];
		row: Record<CSVHeaders, string>;
		valid: boolean;
		update: boolean;
		uuid: string;
	};

	type CsvError = {
		key: string | null;
		error: string;
	};

	$: professionals = ($queryProfessionals.data?.professional || []).reduce(
		(acc, cur) => ({
			...acc,
			[cur.email]: cur,
		}),
		{}
	);

	$: structures = ($queryStructures.data?.structure || []).reduce(
		(acc, cur) => ({
			...acc,
			[cur.name]: cur,
		}),
		{}
	);

	let parsePromise: Promise<BeneficiaryCsvResponse[]>;
	let insertPromise: Promise<BeneficiaryCsvResponse[]>;
	let beneficiariesToImport = [];
	let mode: 'oriented' | 'unoriented' | null = null;

	async function convertCsvFile(formData: FormData): Promise<BeneficiaryCsvResponse[]> {
		const beneficiaries = await postApiFormData<BeneficiaryCsvResponse[]>(
			'/v1/convert-file/beneficiaries',
			formData,
			{
				'jwt-token': $token,
			}
		);

		return beneficiaries.map((beneficiary) => {
			if (beneficiary.valid) {
				const uuid = uuidv4();
				beneficiariesToImport.push(uuid);
				return { uuid, ...beneficiary };
			}
			return { ...beneficiary };
		});
	}

	async function handleFilesSelect(event: CustomEvent<{ acceptedFiles: FileList }>): Promise<void> {
		const file = event.detail.acceptedFiles[0];
		const formData = new FormData();
		formData.append('upload_file', file);
		parsePromise = convertCsvFile(formData);
	}

	function structureNameToStructure(structureName = ''): Structure[] {
		const names = structureName.trim().split(',');
		const structs = names.reduce((acc, name) => {
			const struct = structures[name.trim()];
			if (struct) {
				acc.push(struct);
			}
			return acc;
		}, []);
		return structs;
	}

	function advisorEmailToPros(advisorEmail = ''): Professional[] {
		const emails = advisorEmail.trim().split(',');
		const pros = emails.reduce((acc, email) => {
			const pro = professionals[email.trim()];
			if (pro) {
				acc.push(pro);
			}
			return acc;
		}, []);
		return pros;
	}

	async function handleSubmit(beneficiaries: BeneficiaryCsvResponse[]) {
		const payload = JSON.stringify({
			need_orientation: mode === 'unoriented',
			beneficiaries: beneficiaries.flatMap(({ uuid, data }) =>
				beneficiariesToImport.includes(uuid) ? data : []
			),
		});
		insertPromise = postApiJson<BeneficiaryCsvResponse[]>('/v1/beneficiaries/bulk', payload, {
			'jwt-token': $token,
		});
	}

	const headers = [
		{ label: 'Identifiant dans le SI', key: 'Identifiant dans le SI*', mandatory: true },
		{ label: 'Prénom', key: 'Prénom*', mandatory: true },
		{ label: 'Nom', key: 'Nom*', mandatory: true },
		{ label: 'Date de naissance', key: 'Date de naissance*', mandatory: true },
		{ label: 'NIR', key: 'NIR', mandatory: false },
		{ label: 'Lieu de naissance', key: 'Lieu de naissance', mandatory: false },
		{ label: 'Téléphone', key: 'Téléphone', mandatory: false },
		{ label: 'Courriel', key: 'Email', mandatory: false },
		{ label: 'Adresse', key: 'Adresse', mandatory: false },
		{ label: 'Adresse (complément)', key: 'Adresse (complément)', mandatory: false },
		{ label: 'Code postal', key: 'Code postal', mandatory: false },
		{ label: 'Ville', key: 'Ville', mandatory: false },
		{ label: 'Situation de travail', key: 'Situation', mandatory: false },
		{ label: 'N° CAF/MSA', key: 'Numéro allocataire CAF/MSA', mandatory: false },
		{ label: 'N° Pôle emploi', key: 'Identifiant Pôle emploi', mandatory: false },
		{ label: 'Droits RSA', key: 'Droits RSA', mandatory: false },
		{ label: 'Droits ARE', key: 'Droits ARE', mandatory: false },
		{ label: 'Droits ASS', key: 'Droits ASS', mandatory: false },
		{ label: "Prime d'activité", key: "Prime d'activité", mandatory: false },
		{ label: 'RQTH', key: 'RQTH', mandatory: false },
		{ label: 'Zone de mobilité', key: 'Zone de mobilité', mandatory: false },
		{
			label: 'Emplois recherchés (texte + code ROME)',
			key: 'Emploi recherché (code ROME)',
			mandatory: false,
		},
		{ label: 'Niveau de formation', key: 'Niveau de formation', mandatory: false },
		{ label: 'Structure', key: 'Structure', mandatory: false },
		{ label: 'Accompagnateurs', key: 'Accompagnateurs', mandatory: false },
	];

	function backToFileSelect() {
		beneficiariesToImport = [];
		parsePromise = undefined;
		insertPromise = undefined;
	}

	function displayBoolean(value: unknown): string | null {
		console.log(value);
		if (typeof value === 'boolean') {
			return value ? 'Oui' : 'Non';
		}
	}
</script>

<div class="flex flex-col gap-6">
	{#if !mode}
		<div class="flex justify-around">
			<Button
				outline
				icon="fr-icon-group-line"
				iconSide="left"
				classNames="fr-btn--lg"
				on:click={() => {
					mode = 'unoriented';
				}}
			>
				<span class="block max-w-min">Importer des nouveaux bénéficiaires</span>
			</Button>
			<Button
				outline
				icon="fr-icon-group-fill"
				iconSide="left"
				classNames="fr-btn--lg"
				on:click={() => {
					mode = 'oriented';
				}}
			>
				<span class="block max-w-min">Importer des bénéficiaires existants</span>
			</Button>
		</div>
	{:else if insertPromise === undefined}
		{#if parsePromise === undefined}
			<div>
				Veuillez fournir un fichier au format EXCEL ou CSV.
				<br />Vous pouvez
				<a href="/fichiers/import_beneficiaires.csv" download>télécharger un modèle</a>
				et
				<a href="https://pad.incubateur.net/s/nLmDl89Oi#" target="_blank" rel="noopener noreferrer"
					>consulter la notice de remplissage</a
				>.
			</div>
			<Dropzone
				on:drop={handleFilesSelect}
				multiple={false}
				accept=".csv,.xls,.xlsx"
				containerClasses="cursor-pointer dropzone"
			>
				Déposez votre fichier ou cliquez pour le rechercher sur votre ordinateur.
			</Dropzone>
		{:else}
			{#await parsePromise}
				<Spinner label="Lecture du fichier en cours..." />
			{:then parsedBeneficiaries}
				<p>
					Vous allez importer {pluralize('le', parsedBeneficiaries.length)}
					{pluralize('bénéficiaire', parsedBeneficiaries.length)}
					{pluralize('suivant', parsedBeneficiaries.length)}. Veuillez vérifier que les données sont
					correctes et confirmer.
				</p>
				<div class="border-b border-gray-200 shadow" style="overflow-x: auto;">
					<table class="w-full divide-y divide-gray-300">
						<caption class="sr-only">Récapitulatif des bénéficiaires à importer</caption>
						<thead class="px-2 py-2">
							<th class="px-2 py-2" />
							{#each headers as { label }}
								<th class="px-2 py-2 text-left">{label}</th>
							{/each}
						</thead>
						<tbody class="bg-white divide-y divide-gray-300">
							{#each parsedBeneficiaries as beneficiary}
								{@const lineErrors = Object.fromEntries(
									beneficiary.errors?.map(({ key, error }) => [key, error]) || []
								)}
								{@const structureValue = beneficiary.valid
									? beneficiary.data['Structure']
									: beneficiary.row['Structure']}
								{@const proValue = beneficiary.valid
									? beneficiary.data['Accompagnateurs']
									: beneficiary.row['Accompagnateurs']}
								<tr>
									<td class="px-2 py-2 align-middle">
										{#if beneficiary.valid}
											<Checkbox
												classNames="bottom-3 left-1"
												bind:selectedOptions={beneficiariesToImport}
												groupId={'toImport'}
												option={{ name: beneficiary.uuid, label: '' }}
												disabled={!beneficiary.valid}
												title={`${
													beneficiariesToImport.includes(beneficiary.uuid)
														? 'Ne pas importer'
														: 'Importer'
												} le bénéficiaire ${beneficiary.data['Nom*']} ${
													beneficiary.data['Prénom*']
												}`}
											/>
										{:else}
											<i
												class="ri-alert-line text-error relative left-2"
												title="Le bénéficiaire contient des champs invalides"
											/>
										{/if}
									</td>
									{#each headers.filter(({ key }) => key !== 'Accompagnateurs' && key !== 'Structure') as { key }}
										<td class="px-2 py-2">
											{#if beneficiary.valid}
												{#if key === 'Date de naissance*'}
													<Text value={formatDateLocale(beneficiary.data[key])} defaultValue="" />
												{:else if ["Prime d'activité", 'Droits ARE', 'Droits ASS', 'RQTH'].includes(key)}
													<Text value={displayBoolean(beneficiary.data[key])} defaultValue="" />
												{:else}
													<Text value={beneficiary.data[key]} defaultValue="" />
												{/if}
											{:else if lineErrors[key]}
												<i
													class="ri-alert-line text-error "
													title={translateError(lineErrors[key])}
												/><Text
													class="text-error border-dashed border-b-1 "
													title={translateError(lineErrors[key])}
													value={beneficiary.row[key]}
													defaultValue=""
												/>
											{:else}
												<Text value={beneficiary.row[key]} defaultValue="" />
											{/if}
										</td>
									{/each}
									<td class="px-2 py-2">
										{#if lineErrors['Structure']}
											<i class="ri-alert-line text-error " title={lineErrors['Structure']} />
											<Text value={structureValue} class="text-error" />
										{:else}
											<Text
												value={structureNameToStructure(structureValue ?? '')
													.map((s) => s.name)
													.join(', ')}
												defaultValue=""
											/>
										{/if}
									</td>
									<td class="px-2 py-2">
										{#if lineErrors['Accompagnateurs']}
											<div class="flex">
												<i class="ri-alert-line text-error" title={lineErrors['Accompagnateurs']} />
												<Text value={proValue} class="text-error " />
											</div>
										{:else}
											<Text
												value={advisorEmailToPros(proValue ?? '')
													.map(displayFullName)
													.join(', ')}
												defaultValue=""
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
						{beneficiariesToImport.length || 'Aucun'}
						{pluralize('bénéficiaire', beneficiariesToImport.length)}
						{pluralize('sélectionné', beneficiariesToImport.length)}
						sur {parsedBeneficiaries.length}
					</span>
				</div>
				<div class="mt-6 flex justify-end flex-row gap-4">
					<Button on:click={backToFileSelect} outline={true}>Retour</Button>
					<Button
						on:click={() => handleSubmit(parsedBeneficiaries)}
						disabled={beneficiariesToImport.length < 1}
					>
						Confirmer
					</Button>
				</div>
			{:catch error}
				<Alert type="error" title="lecture du fichier impossible, veuillez contacter le support.">
					<details>
						<summary>voir le détail</summary>
						<pre>{error}</pre>
					</details>
				</Alert>
				<Button on:click={backToFileSelect} outline={true}>Retour</Button>
			{/await}
		{/if}
	{:else}
		{#await insertPromise}
			<Spinner
				label={`Import ${pluralize("d'un", beneficiariesToImport.length, 'des')} ${pluralize(
					'bénéficiaire',
					beneficiariesToImport.length
				)} en cours...`}
			/>
			/>
		{:then insertResults}
			{@const nbBeneficiaryError = insertResults.filter(({ valid }) => !valid).length}
			{@const nbBeneficiaryInserted = insertResults.filter(
				({ valid, update }) => valid && !update
			).length}
			{@const nbBeneficiaryUpdated = insertResults.filter(
				({ valid, update }) => valid && update
			).length}
			{#if nbBeneficiaryInserted > 0 && nbBeneficiaryUpdated === 0}
				<Alert type="success">
					<p>
						{nbBeneficiaryInserted}
						{pluralize('bénéficiaire', nbBeneficiaryInserted)}
						{pluralize('importé', nbBeneficiaryInserted)} sur
						{beneficiariesToImport.length}
						{pluralize('demandé', beneficiariesToImport.length)}.
					</p>
				</Alert>
			{:else if nbBeneficiaryUpdated > 0 || nbBeneficiaryInserted > 0}
				<Alert type="info">
					{#if nbBeneficiaryInserted > 0}
						<p>
							{nbBeneficiaryInserted}
							{pluralize('bénéficiaire', nbBeneficiaryInserted)}
							{pluralize('importé', nbBeneficiaryInserted)}.
						</p>
					{/if}
					{#if nbBeneficiaryUpdated > 0}
						<p>
							{nbBeneficiaryUpdated}
							{pluralize('bénéficiaire', nbBeneficiaryUpdated)}
							mis à jour.
						</p>
					{/if}
				</Alert>
			{:else}
				<Alert type="error" title="Aucun bénéficiaire importé." />
			{/if}
			{#if nbBeneficiaryError > 0}
				<table class="w-full divide-y divide-gray-300">
					<caption>Bénéficiaires non importés</caption>
					<thead class="px-2 py-2">
						<th>Prénom</th>
						<th>Nom</th>
						<th>Date de naissance</th>
						<th />
					</thead>
					<tbody class="bg-white divide-y divide-gray-300">
						{#each insertResults.filter(({ valid }) => !valid) as beneficiary}
							<tr>
								<td class="px-2 py-2 ">
									<Text value={beneficiary.row['Nom*']} />
								</td>
								<td class="px-2 py-2 ">
									<Text value={beneficiary.row['Prénom*']} />
								</td>
								<td class="px-2 py-2 ">
									<Text value={formatDateLocale(beneficiary.row['Date de naissance*'])} />
								</td>
								<td class="px-2 py-2 ">
									{#if beneficiary.errors}
										{#each beneficiary.errors as error}
											<Text class="text-error" value={error.error} />
										{/each}
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		{:catch error}
			<Alert
				type="error"
				title="import des bénéficiaires impossible, veuillez contacter le support."
			>
				<details>
					<summary>voir le detail</summary>
					<pre>{error}</pre>
				</details>
			</Alert>
			<Button on:click={backToFileSelect} outline={true}>Retour</Button>
		{/await}
	{/if}
</div>

<style>
	:global(.dropzone):hover {
		border-color: var(--blue-france-main-525);
	}
	:global(.dropzone):focus {
		border-color: var(--blue-france-main-525);
	}
</style>
