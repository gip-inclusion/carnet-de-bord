<script lang="ts" context="module">
	import type {
		AddNotebookMembersMutation,
		AddNotebookMembersMutationVariables,
		Professional,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { AddNotebookMembersDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, mutation } from '@urql/svelte';
	import type { OperationStore } from '@urql/svelte';
</script>

<script lang="ts">
	import Dropzone from 'svelte-file-dropzone';
	import { v4 as uuidv4 } from 'uuid';
	import Checkbox from '$lib/ui/base/GroupCheckbox.svelte';
	import { Text } from '$lib/ui/utils';
	import { Alert, Button } from '$lib/ui/base';
	import { page } from '$app/stores';
	import { parse as csvParse } from 'csv-parse/browser/esm/sync';

	type NotebookMemberInput = {
		notebookId: string;
		firstname?: string;
		lastname?: string;
		dateOfBirth?: string;
		proEmails: string;
	};
	type NotebookMemberImport = NotebookMemberInput & {
		valid: boolean;
		uid: string;
	};

	export let professionals: Pick<Professional, 'id' | 'email'>[];

	$: proDictEmailToId = professionals.reduce((acc, { id, email }) => ({ ...acc, [email]: id }), {});
	$: proDictIdToEmail = professionals.reduce((acc, { id, email }) => ({ ...acc, [id]: email }), {});
	function proEmailToProId(email: string | null): string | undefined {
		return proDictEmailToId[email];
	}
	function proIdToProEmail(id: string | null): string | undefined {
		return proDictIdToEmail[id];
	}

	let files = [];
	let members: NotebookMemberImport[] = [];

	$: membersToImport = members.filter(({ uid }) => uidToImport.includes(uid));

	function validate(input: null | undefined | Record<string, any>): boolean {
		try {
			return !!input && !!input.notebookId && !!input.proEmails;
		} catch (error) {
			console.error(error);
		}
		return false;
	}

	let uidToImport = [];

	const headers = [
		{ label: 'Identifiant Carnet de bord*', key: 'notebookId' },
		{ label: 'Prénom', key: 'firstname' },
		{ label: 'Nom', key: 'lastname' },
		{ label: 'Date de naissance', key: 'dateOfBirth' },
		{ label: 'Accompagnateurs*', key: 'proEmails' },
	];

	function handleFilesSelect(event: CustomEvent<{ acceptedFiles: Buffer[] }>): void {
		files = event.detail.acceptedFiles;
		for (let i = 0; i < files.length; i++) {
			const reader = new FileReader();
			reader.onload = () => {
				const binaryStr = reader.result;

				const membersDataRaw: Record<string, unknown>[] = csvParse(binaryStr.toString(), {
					from: 2,
					columns: headers.map(({ key }) => key),
					trim: true,
					skip_empty_lines: true,
					delimiter: ';',
					quote: null,
				});
				members = membersDataRaw
					.reduce(
						(
							[valid, invalid]: [NotebookMemberImport[], NotebookMemberImport[]],
							cur: Record<string, any>
						) => {
							cur.uid = uuidv4();
							cur.valid = validate(cur);
							if (cur.valid) {
								valid.push(cur as NotebookMemberImport);
							} else {
								invalid.push(cur as NotebookMemberImport);
							}
							return [valid, invalid];
						},
						[[], []]
					)
					.flat();

				uidToImport = members.filter(({ valid }) => valid).map(({ uid }) => uid);
			};
			reader.readAsText(files[i]);
		}
	}

	const insertStore: OperationStore<
		AddNotebookMembersMutation,
		AddNotebookMembersMutationVariables,
		NotebookMemberInput
	> = operationStore(AddNotebookMembersDocument);
	const inserter = mutation(insertStore);
	let insertInProgress = false;
	let insertResult: { input_: NotebookMemberInput; error: string | null }[];

	async function handleSubmit() {
		insertInProgress = true;
		insertResult = [];
		for (const input of membersToImport) {
			const { notebookId, proEmails } = input;
			const proIds = proEmails
				.split(',')
				.map((s) => s.trim())
				.map(proEmailToProId)
				.filter(Boolean);
			const objects = proIds.map((professionalId) => ({
				memberType: 'referent',
				notebookId,
				professionalId,
			}));
			const result = await inserter({ objects, notebookId });
			let errorMessage = "Une erreur s'est produite, le rattachement n'a pas été importé.";
			if (/uniqueness/i.test(result.error?.message)) {
				errorMessage = 'Ce rattachement existe déjà.';
			}

			insertResult = [
				...insertResult,
				{
					input_: { notebookId, proEmails: proIds.map(proIdToProEmail).join(', ') },
					...(result.error && { error: errorMessage }),
				},
			];
		}
		insertInProgress = false;
	}

	function backToFileSelect() {
		members = [];
	}

	$: successfulImports = (insertResult || []).filter(({ error }) => !error).length;
</script>

<div class="flex flex-col gap-6">
	{#if insertResult === undefined}
		{#if members.length > 0}
			<p>
				Vous allez importer les groupes de suivis suivants. Veuillez vérifier que les données sont
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
						{#each members as member}
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
											} le suivi`}
										/>
									{:else}
										<i
											class="ri-alert-line text-error relative left-4"
											title="Le suivi ne contient pas les informations obligatoires (marquées d'un astérisque)"
										/>
									{/if}
								</td>
								{#each headers as header (header.key)}
									<td class="px-2 py-2"><Text value={member[header.key]} /></td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="mt-6 flex justify-end flex-row gap-4">
				<span>
					{uidToImport.length || 'Aucun'}
					rattachement{uidToImport.length > 1 ? 's' : ''}
					sélectionné{uidToImport.length > 1 ? 's' : ''}
					sur {members.length}
				</span>
			</div>
			<div class="mt-6 flex justify-end flex-row gap-4">
				<Button on:click={backToFileSelect} outline={true}>Retour</Button>
				<Button on:click={handleSubmit} disabled={uidToImport.length < 1}>Confirmer</Button>
			</div>
		{:else}
			<div>
				Veuillez fournir un fichier au format CSV. Les adresses email des accompagnateurs doivent
				être séparées par des virgules.
				<br />Vous pouvez

				<a href={`${$page.params.uuid}/beneficiaires_en_attente`} download
					>télécharger la liste des bénéficiaires en attente de rattachement</a
				>
				.
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
					title={`Ajout ${uidToImport.length > 1 ? 'des' : ' d’un'} rattachement{
						uidToImport.length > 1 ? 's' : ''
					} en cours...`}
				/>
			{:else}
				<Alert
					type={successfulImports ? 'success' : 'error'}
					title={`${successfulImports || 'Aucun'}
					rattachement${successfulImports > 1 ? 's' : ''}
					importé${successfulImports > 1 ? 's' : ''}
					sur ${uidToImport.length}
					demandé${uidToImport.length > 1 ? 's' : ''}.`}
				/>
			{/if}
			{#key insertResult}
				<div class="border-b border-gray-200 shadow">
					<table class="w-full divide-y divide-gray-300">
						<thead class="px-2 py-2">
							<th>Identifiant</th>
							<th>Prénom</th>
							<th>Nom</th>
							<th>Date de naissance</th>
							<th>Accompagnateurs</th>
						</thead>
						<tbody class="bg-white divide-y divide-gray-300">
							{#each insertResult as member}
								<tr>
									<td class="px-2 py-2 ">
										<Text value={member.input_.notebookId} />
									</td>
									<td class="px-2 py-2 ">
										<Text value={member.input_.firstname} />
									</td>
									<td class="px-2 py-2 ">
										<Text value={member.input_.lastname} />
									</td>
									<td class="px-2 py-2 ">
										<Text value={member.input_.dateOfBirth} />
									</td>
									<td class="px-2 py-2 ">
										<Text value={member.input_.proEmails} />
									</td>
									<td class="px-2 py-2 ">
										{#if member.error}
											<Text
												classNames="text-error"
												value={"Une erreur s'est produite, le rattachement n'a pas été importé."}
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
