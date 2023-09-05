<script lang="ts" context="module">
	import type {
		AddNotebookMembersMutation,
		AddNotebookMembersMutationVariables,
		GetStructureQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { AddNotebookMembersDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore } from '@urql/svelte';
	import type { OperationStore } from '@urql/svelte';
</script>

<script lang="ts">
	import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';
	import { ImportParserError, Text } from '$lib/ui/utils';
	import { Alert, Button, GroupCheckbox as Checkbox } from '$lib/ui/base';
	import { page } from '$app/stores';
	import { pluralize } from '$lib/helpers';
	import { parseEntities } from '$lib/utils/importFileParser';
	import { formatDateLocale } from '$lib/utils/date';

	import { displayFullName } from '../format';

	type NotebookMemberInput = {
		notebookId: string;
		firstname?: string;
		lastname?: string;
		dateOfBirth?: string;
		proEmails: string;
	};
	type NotebookMemberBinding = NotebookMemberInput & {
		valid: boolean;
		uid: string;
	};
	type Professional = GetStructureQuery['structure_by_pk']['professionals'][0];

	export let professionals: Professional[];

	$: proDictEmailToId = professionals.reduce(
		(acc, { account: { id }, email }) => ({ ...acc, [email]: id }),
		{}
	);
	$: proDictIdToEmail = professionals.reduce(
		(acc, { account: { id }, email }) => ({ ...acc, [id]: email }),
		{}
	);

	function proEmailToProId(email: string | null): string | undefined {
		return proDictEmailToId[email];
	}

	function proIdToProEmail(id: string | null): string | undefined {
		return proDictIdToEmail[id];
	}

	let files = [];
	let members: NotebookMemberBinding[] = [];

	$: membersToImport = members.filter(({ uid }) => uidToImport.includes(uid));

	let uidToImport = [];
	let parseErrors = [];

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
			parseEntities(
				files[i],
				'NotebookMemberBinding',
				headers,
				({ entities, idToImport }: Record<string, unknown>, errors: string[]): void => {
					members = entities as NotebookMemberBinding[];
					uidToImport = idToImport as string[];
					parseErrors = errors;
				}
			);
		}
	}

	const insertStore: OperationStore<
		AddNotebookMembersMutation,
		AddNotebookMembersMutationVariables,
		NotebookMemberInput
	> = operationStore(AddNotebookMembersDocument, null, {
		additionalTypenames: ['notebook_member', 'beneficiary_structure'],
	});
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
			const objects = proIds.map((accountId) => ({
				memberType: 'referent',
				notebookId,
				accountId,
			}));
			const result = await inserter({ objects });
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
		parseErrors = [];
	}

	$: successfulImports = (insertResult || []).filter(({ error }) => !error).length;
</script>

<div class="flex flex-col gap-6">
	{#if insertResult === undefined}
		{#if members.length > 0}
			<p>
				Vous allez importer {pluralize('le', members.length)}
				{pluralize('groupe', members.length)} de
				{pluralize('suivi', members.length)}
				{pluralize('suivant', members.length)}. Veuillez vérifier que les données sont correctes et
				confirmer.
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
									{#if header.key !== 'proEmails'}
										<td class="px-2 py-2">
											{#if header.key === 'dateOfBirth'}
												<Text value={formatDateLocale(member[header.key])} />
											{:else}
												<Text value={member[header.key]} />
											{/if}
										</td>
									{/if}
								{/each}
								<td class="px-2 py-2">
									<Text value={member.proEmails.split(',').join(', ')} />
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
					{pluralize('rattachement', uidToImport.length)}
					{pluralize('sélectionné', uidToImport.length)}
					sur {members.length}
				</span>
			</div>
			<div class="mt-6 flex justify-end flex-row gap-4">
				<Button on:click={backToFileSelect} outline={true}>Retour</Button>
				<Button on:click={handleSubmit} disabled={uidToImport.length < 1}>Confirmer</Button>
			</div>
		{:else}
			<div>
				Veuillez fournir un fichier au format EXCEL ou CSV. Les adresses email des accompagnateurs
				doivent être séparées par des virgules.
				<br />Vous pouvez
				<a href={`${$page.params.uuid}/beneficiaires_en_attente`} download
					>télécharger la liste des bénéficiaires en attente de rattachement</a
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
					type={successfulImports ? 'success' : 'error'}
					title={`${successfulImports || 'Aucun'}
					${pluralize('rattachement', successfulImports)}
					${pluralize('importé', successfulImports)}
					sur ${uidToImport.length}
					${pluralize('demandé', uidToImport.length)}.`}
				/>
			{/if}
			{#key insertResult}
				<div class="border-b border-gray-200 shadow">
					<table class="w-full divide-y divide-gray-300">
						<thead class="px-2 py-2">
							<th>Identifiant</th>
							<th>Prénom NOM</th>
							<th>Nom</th>
							<th>Date de naissance</th>
							<th>Accompagnateurs</th>
						</thead>
						<tbody class="bg-white divide-y divide-gray-300">
							{#each insertResult as member}
								<tr>
									<td class="px-2 py-2">
										<Text value={member.input_.notebookId} />
									</td>
									<td class="px-2 py-2">
										<Text value={displayFullName(member.input_)} />
									</td>
									<td class="px-2 py-2">
										<Text value={formatDateLocale(member.input_.dateOfBirth)} />
									</td>
									<td class="px-2 py-2">
										<Text value={member.input_.proEmails} />
									</td>
									<td class="px-2 py-2">
										{#if member.error}
											<Text class="text-error" value={member.error} />
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
