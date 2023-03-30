<script lang="ts" context="module">
	import type {
		Beneficiary,
		GetDeploymentInfosQuery,
		GetNotebookForBeneficiaryQuery,
		Notebook,
		Structure,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import {
		AddNotebookMemberWithBeneficiaryStructureUpdateDocument,
		AttachBeneficiaryToStructureDocument,
		DeactivateNotebookMemberDocument,
		GetNotebookForBeneficiaryDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { getClient, mutation, operationStore } from '@urql/svelte';
</script>

<script lang="ts">
	import Dropzone from 'svelte-file-dropzone';
	import { ImportParserError, Text } from '$lib/ui/utils';
	import { Alert, Button, GroupCheckbox as Checkbox } from '$lib/ui/base';
	import { pluralize } from '$lib/helpers';
	import { displayFullName } from '$lib/ui/format';
	import Tag from '../Tag.svelte';
	import { parseEntities } from '$lib/utils/importFileParser';
	import { captureException } from '$lib/utils/sentry';

	const client = getClient();

	type NotebookMemberInput = {
		firstname: string;
		lastname: string;
		dateOfBirth: string;
		addEmails: string;
		removeEmails: string;
		addStructures: string;
	};
	type NotebookMemberImport = NotebookMemberInput & {
		valid: boolean;
		uid: string;
	};
	type ProLight = GetDeploymentInfosQuery['structuresWithPros'][0]['professionals'][0] & {
		structureId: string;
	};
	type BeneficiaryLight = Pick<Beneficiary, 'firstname' | 'lastname' | 'dateOfBirth'>;
	type StructureLight = Pick<Structure, 'id' | 'name'>;
	type NotebookLight = Pick<Notebook, 'id' | 'beneficiaryId'>;

	const insertStore = operationStore(
		AddNotebookMemberWithBeneficiaryStructureUpdateDocument,
		null,
		{
			additionalTypenames: ['beneficiary_structure', 'notebook_member'],
		}
	);
	const inserter = mutation(insertStore);

	const removeStore = operationStore(DeactivateNotebookMemberDocument, null, {
		additionalTypenames: ['notebook_member'],
	});
	const remover = mutation(removeStore);

	const attachStore = operationStore(AttachBeneficiaryToStructureDocument, null, {
		additionalTypenames: ['beneficiary_structure'],
	});
	const attacher = mutation(attachStore);

	export let professionals: ProLight[];
	export let structures: StructureLight[];

	$: proDictEmailToProLight = professionals.reduce(
		(acc, pro) => ({ ...acc, [pro.email]: pro }),
		{}
	);

	$: structuresByName = structures.reduce(
		(acc, structure) => ({ ...acc, [structure.name]: structure }),
		<Record<string, StructureLight>>{}
	);

	function proEmailToPro(email: string | null): ProLight | undefined {
		return proDictEmailToProLight[email];
	}

	const insertSummary: Record<
		string,
		{
			beneficiary: BeneficiaryLight;
			insert: { pro: ProLight; error: string }[];
			remove: { pro: ProLight; error: string }[];
			structures: { structure: StructureLight; error: string }[];
			error: string;
		}
	> = {};
	let files = [];
	let beneficiaries: NotebookMemberImport[] = [];

	$: beneficiariesToImport = beneficiaries.filter(({ uid }) => uidToImport.includes(uid));

	let uidToImport = [];
	let parseErrors = [];

	const headers = [
		{ label: 'Prénom*', key: 'firstname' },
		{ label: 'Nom*', key: 'lastname' },
		{ label: 'Date de naissance*', key: 'dateOfBirth' },
		{ label: 'Accompagnateurs à ajouter*', key: 'addEmails' },
		{ label: 'Accompagnateurs à enlever*', key: 'removeEmails' },
		{ label: 'Structures à rattacher*', key: 'addStructures' },
	];

	function handleFilesSelect(event: CustomEvent<{ acceptedFiles: Buffer[] }>): void {
		files = event.detail.acceptedFiles;
		for (let i = 0; i < files.length; i++) {
			parseEntities(
				files[i],
				'NotebookMemberImport',
				headers,
				({ entities, idToImport }: Record<string, unknown>, errors: string[]): void => {
					beneficiaries = entities as NotebookMemberImport[];
					uidToImport = idToImport as string[];
					parseErrors = errors;
				}
			);
		}
	}

	let insertInProgress = false;

	let insertResult: {
		input_: { pro: ProLight; beneficiary: BeneficiaryLight; beneficiaryId: string };
		error: string | null;
	}[];
	let removeResult: {
		input_: { pro: ProLight; beneficiary: BeneficiaryLight; beneficiaryId: string };
		error: string | null;
	}[];
	let structuresResult: {
		input_: { structure: StructureLight; beneficiary: BeneficiaryLight; beneficiaryId: string };
		error: string | null;
	}[];

	const benefToKey = (beneficiary: { firstname: string; lastname: string; dateOfBirth: string }) =>
		`${beneficiary.firstname}+${beneficiary.dateOfBirth}+${beneficiary.lastname}`;

	const benefToNotebookId =
		(benefKeyToNotebook: Record<string, NotebookLight>) => (beneficiary: BeneficiaryLight) =>
			benefKeyToNotebook[benefToKey(beneficiary)]?.id;

	const benefKeyToBenefId =
		(benefKeyToNotebook: Record<string, NotebookLight>) => (beneficiary: BeneficiaryLight) =>
			benefKeyToNotebook[benefToKey(beneficiary)]?.beneficiaryId;

	const structureNameToStructure = (name: string) => structuresByName[name];

	const createMemberMatch =
		(benefKeyToNotebook: Record<string, NotebookLight>) =>
		(beneficiary: BeneficiaryLight) =>
		(pro: ProLight) => ({
			accountId: { _eq: pro.account.id },
			notebookId: { _eq: benefToNotebookId(benefKeyToNotebook)(beneficiary) },
			active: { _eq: true },
		});

	async function handleSubmit() {
		insertInProgress = true;

		const beneficiariesArray = beneficiariesToImport.map((beneficiary) => ({
			beneficiary: {
				firstname: { _ilike: beneficiary.firstname },
				lastname: { _ilike: beneficiary.lastname },
				dateOfBirth: { _eq: beneficiary.dateOfBirth },
			},
		}));
		const notebookResult = await client
			.query<GetNotebookForBeneficiaryQuery>(GetNotebookForBeneficiaryDocument, {
				array: beneficiariesArray,
			})
			.toPromise();

		const notebooks = notebookResult.data.notebook;
		const benefKeyToNotebook = notebooks.reduce((acc, notebook) => {
			return { ...acc, [benefToKey(notebook.beneficiary)]: notebook };
		}, {} as Record<string, GetNotebookForBeneficiaryQuery['notebook'][0]>);
		const beneficiariesWithNotebook = beneficiariesToImport.reduce((acc, csvBeneficiary) => {
			if (benefKeyToNotebook[benefToKey(csvBeneficiary)]) {
				return [...acc, csvBeneficiary];
			} else {
				insertSummary[benefToKey(csvBeneficiary)] = {
					beneficiary: csvBeneficiary,
					insert: [],
					remove: [],
					structures: [],
					error: 'Ce bénéficiaire est introuvable.',
				};
				return acc;
			}
		}, <NotebookMemberImport[]>[]);

		const insertPayload = beneficiariesWithNotebook.flatMap((csvBeneficiary) => {
			return (csvBeneficiary.addEmails || '')
				.split(',')
				.map((s) => s.trim())
				.map(proEmailToPro)
				.filter(Boolean)
				.map((pro) => ({
					pro,
					withUpdatedStructure:
						pro.structureId !==
						benefKeyToNotebook[benefToKey(csvBeneficiary)].beneficiary.structures[0]?.structureId,
					beneficiary: csvBeneficiary,
					beneficiaryId: benefKeyToBenefId(benefKeyToNotebook)(csvBeneficiary),
					structureId: pro.structureId,
					notebookId: benefToNotebookId(benefKeyToNotebook)(csvBeneficiary),
				}));
		});
		insertResult = [];
		for (const payload of insertPayload) {
			const result = await inserter({
				withUpdatedStructure: payload.withUpdatedStructure,
				notebookId: payload.notebookId,
				accountId: payload.pro.account.id,
				beneficiaryId: payload.beneficiaryId,
				structureId: payload.pro.structureId,
			});
			let errorMessage = "Une erreur s'est produite, le rattachement n'a pas été importé.";
			if (/uniqueness/i.test(result.error?.message)) {
				errorMessage = 'Ce bénéficiaire a déjà un référent unique.';
				captureException(result.error);
			}

			insertResult = [
				...insertResult,
				{
					input_: {
						pro: payload.pro,
						beneficiary: payload.beneficiary,
						beneficiaryId: payload.beneficiaryId,
					},
					...(result.error && { error: errorMessage }),
				},
			];
		}

		const removePayload = beneficiariesWithNotebook.flatMap((beneficiary) =>
			(beneficiary.removeEmails || '')
				.split(',')
				.map((s) => s.trim())
				.map(proEmailToPro)
				.filter(Boolean)
				.map((pro) => ({
					pro,
					beneficiary,
					beneficiaryId: benefKeyToBenefId(benefKeyToNotebook)(beneficiary),
					member: createMemberMatch(benefKeyToNotebook)(beneficiary)(pro),
				}))
		);
		removeResult = [];
		for (const payload of removePayload) {
			const result = await remover({ member: payload.member });
			let error = false;
			let errorMessage = '';

			if (result.error) {
				captureException(result.error);
				error = true;
				errorMessage = "Une erreur s'est produite, le rattachement n'a pas été supprimé.";
			} else if (result.data.update_notebook_member.affected_rows === 0) {
				error = true;
				errorMessage = "Le bénéficiaire n'était pas suivi par cette personne.";
			}

			removeResult = [
				...removeResult,
				{
					input_: {
						beneficiary: payload.beneficiary,
						pro: payload.pro,
						beneficiaryId: payload.beneficiaryId,
					},
					...(error && { error: errorMessage }),
				},
			];
		}

		const structuresPayload = beneficiariesWithNotebook.flatMap((beneficiary) => {
			// we drop line with addEmails since the beneficiary structure link will be
			// created when we add the referent. It also avoid potential mistakes
			// like a user would set a StructureB and a referent in structure A
			if (beneficiary.addEmails) {
				return [];
			}
			return (beneficiary.addStructures || '')
				.split(',')
				.map((s) => s.trim())
				.map(structureNameToStructure)
				.filter(Boolean)
				.map((structure) => ({
					structure,
					beneficiary,
					beneficiaryId: benefKeyToBenefId(benefKeyToNotebook)(beneficiary),
					structureId: structure.id,
				}));
		});
		structuresResult = [];
		for (const payload of structuresPayload) {
			const result = await attacher({
				beneficiaryId: payload.beneficiaryId,
				structureId: payload.structureId,
			});
			const errorMessage = "Une erreur s'est produite, le rattachement n'a pas été fait.";
			if (result.error) {
				captureException(result.error);
			}
			structuresResult = [
				...structuresResult,
				{
					input_: {
						structure: payload.structure,
						beneficiary: payload.beneficiary,
						beneficiaryId: payload.beneficiaryId,
					},
					...(result.error && { error: errorMessage }),
				},
			];
		}
		insertResult.forEach((insert) => {
			let current = insertSummary[benefToKey(insert.input_.beneficiary)];
			if (!current) {
				insertSummary[benefToKey(insert.input_.beneficiary)] = {
					beneficiary: insert.input_.beneficiary,
					insert: [],
					remove: [],
					structures: [],
					error: null,
				};
				current = insertSummary[benefToKey(insert.input_.beneficiary)];
			}
			current.insert.push({ pro: insert.input_.pro, error: insert.error });
		});

		removeResult.forEach((remove) => {
			let current = insertSummary[benefToKey(remove.input_.beneficiary)];
			if (!current) {
				insertSummary[benefToKey(remove.input_.beneficiary)] = {
					beneficiary: remove.input_.beneficiary,
					insert: [],
					remove: [],
					structures: [],
					error: null,
				};
				current = insertSummary[benefToKey(remove.input_.beneficiary)];
			}
			current.remove.push({ pro: remove.input_.pro, error: remove.error });
		});

		structuresResult.forEach((structure) => {
			let current = insertSummary[benefToKey(structure.input_.beneficiary)];
			if (!current) {
				insertSummary[benefToKey(structure.input_.beneficiary)] = {
					beneficiary: structure.input_.beneficiary,
					insert: [],
					remove: [],
					structures: [],
					error: null,
				};
				current = insertSummary[benefToKey(structure.input_.beneficiary)];
			}
			current.structures.push({ structure: structure.input_.structure, error: structure.error });
		});
		insertInProgress = false;
	}

	function backToFileSelect() {
		beneficiaries = [];
		parseErrors = [];
	}
	$: requestedUpdates = (insertResult || []).concat(removeResult || []);
	$: successfulUpdates = requestedUpdates.filter(({ error }) => !error);
</script>

<div class="flex flex-col gap-6">
	{#if insertResult === undefined}
		{#if beneficiaries.length > 0}
			<p>
				Vous allez procéder {pluralize('à la', beneficiaries.length, 'aux')}
				{pluralize('réorientation', beneficiaries.length)} de
				{pluralize('suivante', beneficiaries.length)}. Veuillez vérifier que les données sont
				correctes et confirmer.
			</p>
			<div class="border-b border-gray-200 shadow">
				<table class="w-full divide-y divide-gray-300">
					<thead class="px-2 py-2">
						<th />
						{#each headers as header (header.key)}
							<th>{header.label}</th>
						{/each}
					</thead>
					<tbody class="bg-white divide-y divide-gray-300" style="overflow-x: auto;">
						{#each beneficiaries as member}
							<tr>
								<td class="align-middle">
									{#if member.valid}
										<Checkbox
											classNames="bottom-3 left-3"
											bind:selectedOptions={uidToImport}
											groupId={'toImport'}
											option={{ name: member.uid, label: '' }}
											disabled={!member.valid}
											title={`${
												uidToImport.includes(member.uid) ? 'Ne pas importer' : 'Importer'
											} la réorientation`}
										/>
									{:else}
										<i
											class="ri-alert-line text-error relative left-4"
											title="Il manque certaines informations obligatoires (marquées d'un astérisque)"
										/>
									{/if}
								</td>
								{#each headers as header (header.key)}
									{#if !['addEmails', 'removeEmails', 'addStructures'].includes(header.key)}
										<td class="px-2 py-2">
											<Text value={member[header.key]} />
										</td>
									{/if}
								{/each}
								<td class="px-2 py-2">
									<Text
										value={member.addEmails
											.split(',')
											.map((s) => s.trim())
											.map(proEmailToPro)
											.filter(Boolean)
											.map((pro) => `${pro?.firstname} ${pro?.lastname}`)
											.join(', ')}
									/>
								</td>
								<td class="px-2 py-2">
									<Text
										value={member.removeEmails
											.split(',')
											.map((s) => s.trim())
											.map(proEmailToPro)
											.filter(Boolean)
											.map((pro) => `${pro?.firstname} ${pro?.lastname}`)
											.join(', ')}
									/>
								</td>
								<td class="px-2 py-2">
									<Text
										value={member.addStructures
											.split(',')
											.map((s) => s.trim())
											.map(structureNameToStructure)
											.filter(Boolean)
											.map((structure) => structure.name)
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
					{uidToImport.length || 'Aucun'}
					{pluralize('réorientation', uidToImport.length)}
					{pluralize('sélectionnée', uidToImport.length)}
					sur {beneficiaries.length}
				</span>
			</div>
			<div class="mt-6 flex justify-end flex-row gap-4">
				<Button on:click={backToFileSelect} outline={true}>Retour</Button>
				<Button on:click={handleSubmit} disabled={uidToImport.length < 1}>Confirmer</Button>
			</div>
		{:else}
			<div>
				Veuillez fournir un fichier au format EXCEL ou CSV.
				<br />Vous pouvez
				<a href="/fichiers/import_reorientation.csv" download>télécharger un modèle</a>
				et
				<a href="https://pad.incubateur.net/s/u4_wgDDL_#" target="_blank" rel="noopener noreferrer"
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
						'rattachement',
						uidToImport.length
					)} en cours...`}
				/>
			{:else}
				<Alert
					type={successfulUpdates.length === requestedUpdates.length ? 'success' : 'error'}
					title={`${successfulUpdates.length || 'Aucun'}
					${pluralize('rattachement', successfulUpdates.length)}
					${pluralize('modifié', successfulUpdates.length)}
					sur ${requestedUpdates.length}
					${pluralize('demandé', requestedUpdates.length)}.`}
				/>
			{/if}
			{#key insertResult}
				<div class="border-b border-gray-200 shadow">
					<table class="w-full divide-y divide-gray-300">
						<thead class="px-2 py-2">
							<th>Prénom</th>
							<th>Nom</th>
							<th>Date de naissance</th>
							<th>Ajouts</th>
							<th>Suppressions</th>
						</thead>
						<tbody class="bg-white divide-y divide-gray-300">
							{#each Object.values(insertSummary) as result}
								<tr>
									<td class="px-2 py-2">
										<Text value={result.beneficiary.firstname} />
									</td>
									<td class="px-2 py-2">
										<Text value={result.beneficiary.lastname} />
									</td>
									<td class="px-2 py-2">
										<Text value={result.beneficiary.dateOfBirth} />
									</td>
									{#if result.error}
										<td class="p-2 text text-marianne-red">
											{result.error}
										</td>
									{:else}
										<td class="px-2 py-2">
											{#each result.insert as { pro, error }}
												<Tag
													classNames={error ? 'text-marianne-red' : 'text-success'}
													title={error || 'Ajout effectué !'}
												>
													<i class="ri-{error ? 'close' : 'checkbox'}-circle-line text-xl" />
													{displayFullName(pro)}
												</Tag>
											{:else}
												&mdash;
											{/each}
										</td>
										<td class="px-2 py-2">
											{#each result.remove as { pro, error }}
												<Tag
													classNames={error ? 'text-marianne-red' : 'text-success'}
													title={error || 'Suppression effectuée'}
												>
													<i class="ri-{error ? 'close' : 'checkbox'}-circle-line text-xl" />
													{displayFullName(pro)}
												</Tag>
											{:else}
												&mdash;
											{/each}
										</td>
										<td class="px-2 py-2">
											{#each result.structures as { structure, error }}
												<Tag
													classNames={error ? 'text-marianne-red' : 'text-success'}
													title={error || 'Rattachement effectué !'}
												>
													<i class="ri-{error ? 'close' : 'checkbox'}-circle-line text-xl" />
													{structure.name}
												</Tag>
											{:else}
												&mdash;
											{/each}
										</td>
									{/if}
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
