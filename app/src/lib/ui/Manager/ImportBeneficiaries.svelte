<script lang="ts">
	import { backendAPI, token } from '$lib/stores';
	import {
		GetProfessionalsForManagerDocument,
		type Professional,
		GetStructuresForManagerDocument,
		type Structure,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type {
		GetProfessionalsForManagerQuery,
		GetStructuresForManagerQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, type OperationStore, query } from '@urql/svelte';
	import Dropzone from 'svelte-file-dropzone';
	import { GroupCheckbox as Checkbox } from '$lib/ui/base';
	import { Text, ImportParserError } from '$lib/ui/utils';
	import { Alert, Button } from '$lib/ui/base';
	import { displayFullName } from '$lib/ui/format';
	import { pluralize } from '$lib/helpers';
	import { formatDateLocale } from '$lib/utils/date';
	import { v4 as uuidv4 } from 'uuid';

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

	type Beneficiary = {
		siId: string;
		firstname: string;
		lastname: string;
		dateOfBirth: string;
		placeOfBirth?: string;
		phoneNumber?: string;
		email?: string;
		address1?: string;
		address2?: string;
		postalCode?: string;
		city?: string;
		workSituation?: string;
		cafNumber?: string;
		peNumber?: string;
		rightRsa?: string;
		rightAre?: string;
		rightAss?: string;
		rightBonus?: string;
		rightRqth?: string;
		geographicalArea?: string;
		wantedJobs?: string;
		educationLevel?: string;
		structureName?: string;
		advisorEmail?: string;
		nir?: string;
	};

	type BeneficiaryImport = Beneficiary & {
		valid: boolean;
		uid: string;
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

	$: beneficiaryFrom = (line) => {
		return {
			uid: uuidv4(),
			valid: line.filter((field) => field.error_messages).length === 0,
			siId: line[0].value,
			firstname: line[1].value,
			lastname: line[2].value,
			dateOfBirth: line[3].value || '--',
			placeOfBirth: line[4].value,
			phoneNumber: line[5].value,
			email: line[6].value,
			address1: line[7].value,
			address2: line[8].value,
			postalCode: line[9].value,
			city: line[10].value,
			workSituation: line[11].value,
			cafNumber: line[12].value,
			peNumber: line[13].value,
			rightRsa: line[14].value,
			rightAre: line[15].value,
			rightAss: line[16].value,
			rightBonus: line[17].value,
			rightRqth: line[18].value,
			geographicalArea: line[19].value,
			wantedJobs: line[20].value,
			educationLevel: line[21].value,
			structureName: line[22].value || '',
			advisorEmail: line[23].value || '',
			nir: line[24].value,
		};
	};

	let files = [];
	let beneficiaries: BeneficiaryImport[] = [];

	$: beneficiariesToImport = beneficiaries.filter(({ uid }) => toImport.includes(uid));

	let toImport = [];
	let parseErrors = [];

	async function fileValidationApi(file) {
		const formData = new FormData();
		formData.append('upload_file', file);
		return await fetch(`${$backendAPI}/v1/convert-file/beneficiaries`, {
			method: 'POST',
			body: formData,
			headers: {
				'jwt-token': $token,
				Accept: 'application/json; version=1.0',
			},
		});
	}

	async function importBeneficiaries(beneficiaries) {
		return await fetch(`${$backendAPI}/v1/beneficiaries/bulk`, {
			method: 'POST',
			body: JSON.stringify(beneficiaries),
			headers: {
				'jwt-token': $token,
				Accept: 'application/json; version=1.0',
				'Content-Type': 'application/json',
			},
		});
	}

	async function handleFilesSelect(event: CustomEvent<{ acceptedFiles: Buffer[] }>): Promise<void> {
		parseErrors = [];
		files = event.detail.acceptedFiles;
		for (let i = 0; i < files.length; i++) {
			const parsingResponse = await fileValidationApi(files[i]);
			const responseBody = await parsingResponse.json();
			if (parsingResponse.ok) {
				beneficiaries = responseBody.map((line) => beneficiaryFrom(line));
				toImport = beneficiaries
					.filter((beneficiary) => beneficiary.valid)
					.map((beneficiary) => beneficiary.uid);
			} else if (responseBody.detail) {
				parseErrors.push(responseBody.detail);
			} else {
				parseErrors.push('Unknown error while parsing imported file');
			}
		}
	}

	let insertInProgress = false;
	let insertResult: { benef: Beneficiary; error: string | null }[];

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

	async function handleSubmit() {
		insertInProgress = true;
		insertResult = [];
		const response = await importBeneficiaries(beneficiariesToImport);

		const insertOperationResponse = await response.json();
		for (var i = 0; i < beneficiariesToImport.length; i++) {
			insertResult = [
				...insertResult,
				{
					benef: {
						siId: beneficiariesToImport[i].siId,
						firstname: beneficiariesToImport[i].firstname,
						lastname: beneficiariesToImport[i].lastname,
						dateOfBirth: beneficiariesToImport[i].dateOfBirth,
						placeOfBirth: beneficiariesToImport[i].placeOfBirth,
					},
					error: insertOperationResponse.result[i].error,
				},
			];
		}
		insertInProgress = false;
	}

	const headers = [
		{ label: 'Identifiant dans le SI*', key: 'siId' },
		{ label: 'Prénom*', key: 'firstname' },
		{ label: 'Nom*', key: 'lastname' },
		{ label: 'Date de naissance*', key: 'dateOfBirth' },
		{ label: 'NIR', key: 'nir' },
		{ label: 'Lieu de naissance', key: 'placeOfBirth' },
		{ label: 'Téléphone', key: 'phoneNumber' },
		{ label: 'Courriel', key: 'email' },
		{ label: 'Adresse', key: 'address1' },
		{ label: 'Adresse (complément)', key: 'address2' },
		{ label: 'Code postal', key: 'postalCode' },
		{ label: 'Ville', key: 'city' },
		{ label: 'Situation de travail', key: 'workSituation' },
		{ label: 'N° CAF/MSA', key: 'cafNumber' },
		{ label: 'N° Pôle emploi', key: 'peNumber' },
		{ label: 'Droits RSA', key: 'rightRsa' },
		{ label: 'Droits ARE', key: 'rightAre' },
		{ label: 'Droits ASS', key: 'rightAss' },
		{ label: "Prime d'activité", key: 'rightBonus' },
		{ label: 'RQTH', key: 'rightRqth' },
		{ label: 'Zone de mobilité', key: 'geographicalArea' },
		{ label: 'Emplois recherchés (texte + code ROME)', key: 'wantedJobs' },
		{ label: 'Niveau de formation', key: 'educationLevel' },
		{ label: 'Structure', key: 'structureName' },
		{ label: 'Accompagnateurs', key: 'advisorEmail' },
	];

	function backToFileSelect() {
		beneficiaries = [];
		parseErrors = [];
	}

	$: successfulImports = (insertResult || []).filter(({ error }) => !error).length;
</script>

<div class="flex flex-col gap-6">
	{#if insertResult === undefined}
		{#if beneficiaries.length > 0}
			<p>
				Vous allez importer {pluralize('le', beneficiaries.length)}
				{pluralize('bénéficiaire', beneficiaries.length)}
				{pluralize('suivant', beneficiaries.length)}. Veuillez vérifier que les données sont
				correctes et confirmer.
			</p>
			<div class="border-b border-gray-200 shadow" style="overflow-x: auto;">
				<table class="w-full divide-y divide-gray-300">
					<thead class="px-2 py-2">
						<th class="px-2 py-2" />
						{#each headers as { label } (label)}
							<th class="px-2 py-2">{label}</th>
						{/each}
					</thead>
					<tbody class="bg-white divide-y divide-gray-300">
						{#each beneficiaries as beneficiary}
							<tr>
								<td class="px-2 py-2 align-middle">
									{#if beneficiary.valid}
										<Checkbox
											classNames="bottom-3 left-1"
											bind:selectedOptions={toImport}
											groupId={'toImport'}
											option={{ name: beneficiary.uid, label: '' }}
											disabled={!beneficiary.valid}
											title={`${
												toImport.includes(beneficiary.uid) ? 'Ne pas importer' : 'Importer'
											} le bénéficiaire`}
										/>
									{:else}
										<i
											class="ri-alert-line text-error relative left-2"
											title="Le bénéficiaire ne contient pas les informations obligatoires (marquées d'un astérisque) : {headers
												.reduce((acc, cur) => {
													if (cur.label.endsWith('*')) {
														acc.push(cur.label.slice(0, -1));
													}
													return acc;
												}, [])
												.join(', ')}"
										/>
									{/if}
								</td>
								{#each headers as { key } (key)}
									{#if key !== 'advisorEmail' && key !== 'structureName'}
										<td class="px-2 py-2">
											{#if key === 'dateOfBirth'}
												<Text value={formatDateLocale(beneficiary[key])} />
											{:else}
												<Text value={beneficiary[key]} />
											{/if}
										</td>
									{/if}
								{/each}
								<td class="px-2 py-2">
									<Text
										value={structureNameToStructure(beneficiary.structureName)
											.map((s) => s.name)
											.join(', ')}
									/>
								</td>
								<td class="px-2 py-2">
									<Text
										value={advisorEmailToPros(beneficiary.advisorEmail)
											.map(displayFullName)
											.join(', ')}
									/>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<ImportParserError {parseErrors} />
			<div class="mt-6 flex justify-end flex-row gap-4">
				<span>
					{toImport.length || 'Aucune'}
					{pluralize('bénéficiaire', toImport.length)}
					{pluralize('sélectionné', toImport.length)}
					sur {beneficiaries.length}
				</span>
			</div>
			<div class="mt-6 flex justify-end flex-row gap-4">
				<Button on:click={backToFileSelect} outline={true}>Retour</Button>
				<Button on:click={handleSubmit} disabled={toImport.length < 1}>Confirmer</Button>
			</div>
		{:else}
			<div>
				Veuillez fournir un fichier au format EXCEL ou CSV.
				<br />Vous pouvez
				<a href="/fichiers/import_beneficiaires.csv" download>télécharger un modèle</a>
				et
				<a href="https://pad.incubateur.net/s/nLmDl89Oi#" target="_blank" rel="noopener noreferrer"
					>consulter la notice de remplissage</a
				>.
				<br />Il est recommandé de ne pas importer plus d'environ 300 bénéficiaires à la fois.
			</div>
			<Dropzone on:drop={handleFilesSelect} multiple={false} accept=".csv,.xls,.xlsx">
				<span class="cursor-default"
					>Déposez votre fichier ou cliquez pour le rechercher sur votre ordinateur.</span
				>
			</Dropzone>
			<ImportParserError {parseErrors} />
		{/if}
	{:else}
		<div class="flex flex-col gap-4">
			{#if insertInProgress}
				<Alert
					type="info"
					title={`Ajout ${pluralize("d'un", toImport.length, 'des')} ${pluralize(
						'bénéficiaire',
						toImport.length
					)} en cours... ${insertResult.length}/${toImport.length}`}
				/>
			{:else}
				<Alert
					type={successfulImports ? 'success' : 'error'}
					title={`${successfulImports || 'Aucun'}
					${pluralize('bénéficiaire', successfulImports)}
					${pluralize('importé', successfulImports)}
					sur ${toImport.length}
					${pluralize('demandé', toImport.length)}.`}
				/>
			{/if}
			{#if toImport.length < 100}
				{#key insertResult}
					<div class="border-b border-gray-200 shadow">
						<table class="w-full divide-y divide-gray-300">
							<thead class="px-2 py-2">
								<th>Prénom</th>
								<th>Nom</th>
								<th>Date de naissance</th>
								<th>Lieu de naissance</th>
							</thead>
							<tbody class="bg-white divide-y divide-gray-300">
								{#each insertResult as beneficiary}
									<tr>
										<td class="px-2 py-2 ">
											<Text value={beneficiary.benef.firstname} />
										</td>
										<td class="px-2 py-2 ">
											<Text value={beneficiary.benef.lastname} />
										</td>
										<td class="px-2 py-2 ">
											<Text value={formatDateLocale(beneficiary.benef.dateOfBirth)} />
										</td>
										<td class="px-2 py-2 ">
											<Text value={beneficiary.benef.placeOfBirth} />
										</td>
										<td class="px-2 py-2 ">
											{#if beneficiary.error}
												<Text classNames="text-error" value={beneficiary.error} />
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
			{/if}
		</div>
	{/if}
</div>
