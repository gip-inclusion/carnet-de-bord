<script lang="ts">
	import {
		ImportBeneficiaryDocument,
		GetProfessionalsForManagerDocument,
		Professional,
		GetStructuresForManagerDocument,
		Structure,
		GetRomeCodesDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type {
		ImportBeneficiaryMutation,
		ImportBeneficiaryMutationVariables,
		GetProfessionalsForManagerQuery,
		GetRomeCodesQuery,
		GetStructuresForManagerQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, OperationStore, query, mutation, getClient } from '@urql/svelte';
	import Dropzone from 'svelte-file-dropzone';
	import { GroupCheckbox as Checkbox } from '$lib/ui/base';
	import { Text, ImportParserError } from '$lib/ui/utils';
	import { Alert, Button } from '$lib/ui/base';
	import { displayFullName } from '$lib/ui/format';
	import * as keys from '$lib/constants/keys';
	import { parseEntities } from '$lib/utils/importFileParser';
	import { pluralize } from '$lib/helpers';
	import { formatDateLocale } from '$lib/utils/date';

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
		internalId: string;
		firstname: string;
		lastname: string;
		dateOfBirth: string;
		placeOfBirth?: string;
		mobileNumber?: string;
		email?: string;
		address1?: string;
		address2?: string;
		postalCode?: string;
		city?: string;
		needOrientation?: string;
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
		structureNames?: string;
		proEmails?: string;
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

	let files = [];
	let beneficiaries: BeneficiaryImport[] = [];

	$: beneficiariesToImport = beneficiaries.filter(({ uid }) => toImport.includes(uid));

	let toImport = [];
	let parseErrors = [];

	function handleFilesSelect(event: CustomEvent<{ acceptedFiles: Buffer[] }>): void {
		files = event.detail.acceptedFiles;
		for (let i = 0; i < files.length; i++) {
			parseEntities(
				files[i],
				'BeneficiaryImport',
				headers,
				({ entities, idToImport }: Record<string, unknown>, errors: string[]): void => {
					beneficiaries = entities as BeneficiaryImport[];
					toImport = idToImport as string[];
					parseErrors = errors;
				}
			);
		}
	}

	const insertStore: OperationStore<
		ImportBeneficiaryMutation,
		ImportBeneficiaryMutationVariables,
		Beneficiary
	> = operationStore(ImportBeneficiaryDocument);
	const inserter = mutation(insertStore);
	let insertInProgress = false;
	let insertResult: { benef: Beneficiary; error: string | null }[];

	function stringToBool(s: string): boolean {
		if (!s) {
			return false;
		}
		if ('Oui' === s.trim()) {
			return true;
		}
		return false;
	}

	function stringToRightRsa(s: string): string {
		return keys.rsaRightKeys.byValue[s] || null;
	}

	function stringToWorkSituation(s: string): string {
		return keys.workSituationKeys.byValue[s] || null;
	}

	function stringToGeographicalArea(s: string): string {
		return keys.geographicalAreaKeys.byValue[s] || null;
	}

	function stringToRomeCode(map: Record<string, string>) {
		return function (s: string): string {
			return map[s] || null;
		};
	}

	function stringToEducationLevel(s: string): string {
		return keys.educationLevelKeys.byValue[s] || null;
	}

	function structureNamesToStructure(structureNames = ''): Structure[] {
		const names = structureNames.trim().split(',');
		const structs = names.reduce((acc, name) => {
			const struct = structures[name.trim()];
			if (struct) {
				acc.push(struct);
			}
			return acc;
		}, []);
		return structs;
	}

	function proEmailsToPros(proEmails = ''): Professional[] {
		const emails = proEmails.trim().split(',');
		const pros = emails.reduce((acc, email) => {
			const pro = professionals[email.trim()];
			if (pro) {
				acc.push(pro);
			}
			return acc;
		}, []);
		return pros;
	}

	function getStatusForStructureAssignement(structureId: string, pros: Professional[]): string {
		if (pros.map((pro) => pro.structureId).includes(structureId)) {
			return 'done';
		}
		return 'pending';
	}

	const client = getClient();

	async function handleSubmit() {
		insertInProgress = true;
		insertResult = [];

		const labels = beneficiariesToImport.flatMap(
			(beneficiary) => beneficiary.wantedJobs?.split(',').map((s) => s.trim()) ?? []
		);
		const romeCodesResult = await client
			.query<GetRomeCodesQuery>(GetRomeCodesDocument, { search: '', labels })
			.toPromise();

		const labelToRomeCode = romeCodesResult.data?.batch.reduce(
			(acc, { id, label }) => ({ ...acc, [label]: id }),
			{}
		);
		const romeCodeMatcher = stringToRomeCode(labelToRomeCode);
		for (const beneficiary of beneficiariesToImport) {
			const { uid, valid, proEmails = '', structureNames = '', ...benef } = beneficiary;
			const accountIds = proEmailsToPros(proEmails).map(({ account }) => account.id);
			const members = accountIds.map((accountId) => ({ memberType: 'referent', accountId }));
			const structureIds = structureNamesToStructure(structureNames).map(({ id }) => id);
			const structs = structureIds.map((structureId) => ({
				structureId,
				status: getStatusForStructureAssignement(structureId, proEmailsToPros(proEmails)),
			}));
			const payload = {
				...benef,
				needOrientation: stringToBool(benef.needOrientation),
				workSituation: stringToWorkSituation(benef.workSituation),
				rightRsa: stringToRightRsa(benef.rightRsa),
				rightAre: stringToBool(benef.rightAre),
				rightAss: stringToBool(benef.rightAss),
				rightBonus: stringToBool(benef.rightBonus),
				rightRqth: stringToBool(benef.rightRqth),
				geographicalArea: stringToGeographicalArea(benef.geographicalArea),
				educationLevel: stringToEducationLevel(benef.educationLevel),
				members,
				structures: structs,
				wantedJobs: beneficiary.wantedJobs
					.split(',')
					.map((s) => s.trim())
					.map(romeCodeMatcher)
					.filter(Boolean)
					.map((rome_code_id) => ({
						rome_code_id,
					})),
			};
			await Promise.all([
				inserter(payload),
				new Promise((resolve) => {
					setTimeout(resolve, 500);
				}),
			]);
			insertResult = [
				...insertResult,
				{ benef, error: insertStore.error ? insertStore.error.toString() : null },
			];
		}
		insertInProgress = false;
	}

	const headers = [
		{ label: 'Identifiant dans le SI*', key: 'internalId' },
		{ label: 'Prénom*', key: 'firstname' },
		{ label: 'Nom*', key: 'lastname' },
		{ label: 'Date de naissance*', key: 'dateOfBirth' },
		{ label: 'Lieu de naissance', key: 'placeOfBirth' },
		{ label: 'Téléphone', key: 'mobileNumber' },
		{ label: 'Courriel', key: 'email' },
		{ label: 'Adresse', key: 'address1' },
		{ label: 'Adresse (complément)', key: 'address2' },
		{ label: 'Code postal', key: 'postalCode' },
		{ label: 'Ville', key: 'city' },
		{ label: 'À orienter', key: 'needOrientation' },
		{ label: 'Situation de travail', key: 'workSituation' },
		{ label: 'N° CAF/MSA', key: 'cafNumber' },
		{ label: 'N° Pôle emploi', key: 'peNumber' },
		{ label: 'Droits RSA', key: 'rightRsa' },
		{ label: 'Droits ARE', key: 'rightAre' },
		{ label: 'Droits ASS', key: 'rightAss' },
		{ label: "Prime d'activité", key: 'rightBonus' },
		{ label: 'AAH', key: 'rightRqth' },
		{ label: 'Zone de mobilité', key: 'geographicalArea' },
		{ label: 'Emplois recherchés (texte + code ROME)', key: 'wantedJobs' },
		{ label: 'Niveau de formation', key: 'educationLevel' },
		{ label: 'Structure', key: 'structureNames' },
		{ label: 'Accompagnateurs', key: 'proEmails' },
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
									{#if key !== 'proEmails' && key !== 'structureNames'}
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
										value={structureNamesToStructure(beneficiary.structureNames)
											.map((s) => s.name)
											.join(', ')}
									/>
								</td>
								<td class="px-2 py-2">
									<Text
										value={proEmailsToPros(beneficiary.proEmails).map(displayFullName).join(', ')}
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
				<a href="https://pad.incubateur.net/s/VSXZgm8fy#" target="_blank" rel="noopener noreferrer"
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
					title={`${successfulImports || 'Aucune'}
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
			{/if}
		</div>
	{/if}
</div>
