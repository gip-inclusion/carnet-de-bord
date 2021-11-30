<script lang="ts">
	import {
		CreateBeneficiaryDocument,
		CreateBeneficiaryMutation,
		CreateBeneficiaryMutationVariables,
		GetProfessionalsForDeploymentDocument,
		GetProfessionalsForDeploymentQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, OperationStore, query, mutation } from '@urql/svelte';
	import Svelecte from 'svelecte';
	import Dropzone from 'svelte-file-dropzone';
	import Checkbox from '$lib/ui/base/GroupCheckbox.svelte';
	import { Text } from '$lib/ui/utils';
	import { v4 as uuidv4 } from 'uuid';
	import { Alert, Button } from '$lib/ui/base';
	import { displayFullName } from '../format';

	export let deploymentId: string;

	let queryProfessionals: OperationStore<GetProfessionalsForDeploymentQuery> = operationStore(
		GetProfessionalsForDeploymentDocument,
		{
			deploymentId,
		}
	);
	query(queryProfessionals);

	type Beneficiary = {
		firstname: string;
		lastname: string;
		dateOfBirth: string;
		mobileNumber?: string;
		email?: string;
		address1?: string;
		address2?: string;
		postalCode?: string;
		city?: string;
		workSituation?: string;
		cafNumber?: string;
		peNumber?: string;
	};

	type BeneficiaryImport = Beneficiary & {
		valid: boolean;
		uid: string;
		professionalId: string;
		additionalProfessionalId?: string;
	};

	$: professionals = ($queryProfessionals.data?.professional || []).map((pro) => ({
		...pro,
		name: `${displayFullName(pro)} (${pro.structure.name})`,
	}));
	let professional: { id: string };
	$: professionalId = professional?.id;

	let files = [];
	let beneficiaries: BeneficiaryImport[] = [];

	$: beneficiariesToImport = beneficiaries.filter(({ uid }) => toImport.includes(uid));

	function validate(benef: unknown): benef is BeneficiaryImport {
		return !!benef && !!(benef as Beneficiary).firstname && !!(benef as Beneficiary).lastname;
	}

	function processRawCSV(data: string): BeneficiaryImport[] {
		const output = [];
		const rows = data.split('\n');
		for (let i = 0; i < rows.length; i++) {
			if (rows[i].replace(/\s/, '')) {
				const cells = rows[i].split(',');
				const beneficiary = { uid: uuidv4() } as BeneficiaryImport;
				for (let j = 0; j < headers.length; j++) {
					beneficiary[headers[j].key] = cells[j] || null;
				}
				beneficiary.valid = validate(beneficiary);
				output.push(beneficiary);
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
				beneficiaries = processRawCSV(binaryStr.toString())
					.reduce(
						([valid, invalid], cur) => {
							if (cur.valid) {
								valid.push(cur);
							} else {
								invalid.push(cur);
							}
							return [valid, invalid];
						},
						<[BeneficiaryImport[], BeneficiaryImport[]]>[[], []]
					)
					.reduce((acc, cur) => {
						return [...acc, ...cur];
					}, []);

				toImport = beneficiaries.filter(({ valid }) => valid).map(({ uid }) => uid);
			};
			reader.readAsText(files[i]);
		}
	}

	const insertStore: OperationStore<
		CreateBeneficiaryMutation,
		CreateBeneficiaryMutationVariables,
		Beneficiary
	> = operationStore(CreateBeneficiaryDocument);
	const inserter = mutation(insertStore);
	let insertInProgress = false;
	let insertResult: { benef: Beneficiary; error: string | null }[];

	async function handleSubmit() {
		insertInProgress = true;
		insertResult = [];
		for (const beneficiary of beneficiariesToImport) {
			const { uid, valid, additionalProfessionalId, ...benef } = beneficiary;
			const members = [{ memberType: 'referent', professionalId }];
			const payload = { ...benef, deploymentId, members };
			if (additionalProfessionalId) {
				members.push({ memberType: '', professionalId: additionalProfessionalId });
			}
			await inserter(payload);
			await new Promise((resolve) => {
				setTimeout(resolve, 500);
			});
			insertResult = [
				...insertResult,
				{ benef, error: insertStore.error ? insertStore.error.toString() : null },
			];
		}
		insertInProgress = false;
	}

	const headers = [
		{ label: 'Prénom*', key: 'firstname' },
		{ label: 'Nom*', key: 'lastname' },
		{ label: 'Date de naissance*', key: 'dateOfBirth' },
		{ label: 'Téléphone', key: 'mobileNumber' },
		{ label: 'Courriel', key: 'email' },
		{ label: 'Adresse', key: 'address1' },
		{ label: 'Adresse (complément)', key: 'address2' },
		{ label: 'Code postal', key: 'postalCode' },
		{ label: 'Ville', key: 'city' },
		{ label: 'Situation de travail', key: 'workSituation' },
		{ label: 'N° CAF', key: 'cafNumber' },
		{ label: 'N° Pôle emploi', key: 'peNumber' },
	];

	function backToFileSelect() {
		beneficiaries = [];
	}

	$: successfulImports = (insertResult || []).filter(({ error }) => !error).length;
</script>

<div class="flex flex-col gap-6">
	{#if insertResult === undefined}
		<div class="flex flex-row gap-4">
			<div class="flex items-center">
				<label class="mb-2 fr-label" for="professionalSelect">
					<div>Choisissez le professionnel de rattachement</div>
				</label>
			</div>
			<div class="flex items-center !flex-grow-0 w-1/2">
				<Svelecte
					name="professionalSelect"
					options={professionals}
					placeholder=""
					bind:selection={professional}
					disableSifter={false}
					class="svelecte-control custom-svelecte"
					valueField="id"
					labelField="name"
					clearable={true}
				/>
			</div>
		</div>
		{#if beneficiaries.length > 0}
			<p>
				Vous allez importer les bénéficiaires suivants. Veuillez vérifier que les données sont
				correctes et confirmer.
			</p>
			<div class="border-b border-gray-200 shadow" style="overflow-x: auto;">
				<table class="w-full divide-y divide-gray-300">
					<thead class="px-2 py-2">
						<th class="px-2 py-2" />
						<th class="px-2 py-2">Prénom*</th>
						<th class="px-2 py-2">Nom*</th>
						<th class="px-2 py-2">Date de naissance*</th>
						<th class="px-2 py-2">Téléphone</th>
						<th class="px-2 py-2">Courriel</th>
						<th class="px-2 py-2">Adresse</th>
						<th class="px-2 py-2">Adresse (complément)</th>
						<th class="px-2 py-2">Code postal</th>
						<th class="px-2 py-2">Ville</th>
						<th class="px-2 py-2">Situation de travail</th>
						<th class="px-2 py-2">N° CAF</th>
						<th class="px-2 py-2">N° Pôle emploi</th>
						<th class="px-2 py-2">Accompagnant supplémentaire</th>
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
											title="Le bénéficiaire ne contient pas les informations obligatoires (marquées d'un astérisque)"
										/>
									{/if}
								</td>
								<td class="px-2 py-2"><Text value={beneficiary.firstname} /></td>
								<td class="px-2 py-2"><Text value={beneficiary.lastname} /></td>
								<td class="px-2 py-2"><Text value={beneficiary.dateOfBirth} /></td>
								<td class="px-2 py-2"><Text value={beneficiary.mobileNumber} /></td>
								<td class="px-2 py-2"><Text value={beneficiary.email} /></td>
								<td class="px-2 py-2"><Text value={beneficiary.address1} /></td>
								<td class="px-2 py-2"><Text value={beneficiary.address2} /></td>
								<td class="px-2 py-2"><Text value={beneficiary.postalCode} /></td>
								<td class="px-2 py-2"><Text value={beneficiary.city} /></td>
								<td class="px-2 py-2"><Text value={beneficiary.workSituation} /></td>
								<td class="px-2 py-2"><Text value={beneficiary.cafNumber} /></td>
								<td class="px-2 py-2"><Text value={beneficiary.peNumber} /></td>
								<td class="px-2 py-2">
									{#if beneficiary.valid}
										<Svelecte
											name={`professionalSelect-${beneficiary.firstname}-${beneficiary.lastname}`}
											options={professionals.filter(({ id }) => id !== professionalId)}
											placeholder=""
											bind:value={beneficiary.additionalProfessionalId}
											disableSifter={false}
											class="svelecte-control custom-svelecte"
											valueField="id"
											labelField="name"
											clearable={true}
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
					bénéficiaire{toImport.length > 1 ? 's' : ''}
					sélectionné{toImport.length > 1 ? 's' : ''}
					sur {beneficiaries.length}
				</span>
			</div>
			<div class="mt-6 flex justify-end flex-row gap-4">
				<Button on:click={backToFileSelect} outline={true}>Retour</Button>
				<Button on:click={handleSubmit} disabled={toImport.length < 1 || !professionalId}
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
					title={`Ajout de${toImport.length > 1 ? 's' : ' la'} bénéficiaire${
						toImport.length > 1 ? 's' : ''
					} en cours...`}
				/>
			{:else}
				<Alert
					type={successfulImports ? 'success' : 'error'}
					title={`${successfulImports || 'Aucune'}
					bénéficiaire${successfulImports > 1 ? 's' : ''}
					importé${successfulImports > 1 ? 's' : ''}
					sur ${toImport.length}
					demandé${toImport.length > 1 ? 's' : ''}.`}
				/>
			{/if}
			{#key insertResult}
				<div class="border-b border-gray-200 shadow">
					<table class="w-full divide-y divide-gray-300">
						<thead class="px-2 py-2">
							<th>Prénom</th>
							<th>Nom</th>
							<th>Date de naissance</th>
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
										<Text value={beneficiary.benef.dateOfBirth} />
									</td>
									<td class="px-2 py-2 ">
										{#if beneficiary.error}
											<Text
												classNames="text-error"
												value={"Une erreur s'est produite, le bénéficiaire n'a pas été importé."}
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
