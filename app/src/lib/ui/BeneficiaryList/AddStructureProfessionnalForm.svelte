<script lang="ts">
	import {
		GetStructuresWithProDocument,
		type GetStructuresWithProQuery,
		RemoveReferentDocument,
		UpdateReferentWithStructureDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { Checkbox, Select } from '../base';
	import { displayFullName } from '../format';
	import { mutation, operationStore, query } from '@urql/svelte';
	import type { OperationStore } from '@urql/svelte';
	import Button from '../base/Button.svelte';
	import { openComponent } from '$lib/stores';
	import Alert from '../base/Alert.svelte';
	import { pluralize } from '$lib/helpers';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	export let member: string = null;
	export let notebooks: { beneficiaryId: string; notebookId: string }[];
	export let showResetMembers = false;
	export let structuresId: string[] = [];

	export let onClose: () => void;

	const deleteReferent = mutation({ query: RemoveReferentDocument });
	const updateReferent = mutation({ query: UpdateReferentWithStructureDocument });
	let structures: OperationStore<GetStructuresWithProQuery> = operationStore(
		GetStructuresWithProDocument
	);

	query(structures);

	$: structureOptions =
		$structures.data?.structure.map(({ id, name }) => ({
			name: id,
			label: name,
		})) ?? [];

	$: structure = $structures.data?.structure.find(({ id }) => id === selectedStructure) ?? null;

	$: professionalOptions =
		structure?.professionals.map((pro) => ({
			name: pro.account.id,
			label: displayFullName(pro),
		})) ?? [];
	let selectedStructure = structuresId.length === 1 ? structuresId[0] : null;
	let selectedMember = member;
	let resetMembers: boolean;
	let error = false;

	async function handleSubmit() {
		if (resetMembers) {
			const deleteResponse = await deleteReferent({
				notebooks: notebooks.map(({ notebookId }) => notebookId),
			});
			if (deleteResponse.error) {
				error = true;
				console.log(deleteResponse.error);
				return;
			}
		}

		const updateResponse = await updateReferent(
			{
				objects: selectedMember
					? notebooks.map(({ notebookId }) => ({
							notebookId,
							memberType: 'referent',
							accountId: selectedMember,
							active: true,
					  }))
					: [],
				beneficiaryStructureObjects: notebooks.map(({ beneficiaryId }) => ({
					beneficiaryId,
					structureId: selectedStructure,
					status: selectedMember ? 'done' : 'pending',
				})),
				beneficiaries: notebooks.map(({ beneficiaryId }) => beneficiaryId),
			},
			{ additionalTypenames: ['notebook_member'] }
		);
		if (updateResponse.error) {
			error = true;
			console.log(updateResponse.error);
			return;
		}
		if (onClose) onClose();
		openComponent.close();
	}

	function close() {
		openComponent.close();
	}
</script>

<section class="flex flex-col w-full">
	<div class="pb-8">
		<h1>Rattacher des bénéficiaires</h1>

		<form on:submit|preventDefault={handleSubmit}>
			<LoaderIndicator result={structures}>
				<p>Veuillez sélectionner la structure d'accueil.</p>

				<Select
					bind:selected={selectedStructure}
					selectLabel="Nom de la structure"
					selectHint="Sélectionner une structure"
					options={structureOptions}
					name="structure"
					id="structure"
					on:select={() => {
						selectedMember = null;
					}}
				/>

				<p>
					Veuillez sélectionner le nouveau référent unique {pluralize(
						'du',
						notebooks.length,
						'des'
					)}
					{pluralize('bénéficiaire', notebooks.length)}.
				</p>
				<!-- <pre>{JSON.stringify(structure?.professionals, null, 2)}</pre> -->
				<Select
					bind:selected={selectedMember}
					selectLabel={member ? 'Nom du nouveau référent unique' : 'Nom du référent unique'}
					selectHint="Sélectionner un professionnel"
					additionalLabel="La sélection du professionnel n’est pas obligatoire."
					options={professionalOptions}
					name="professional"
					id="professional"
					disabled={!selectedStructure}
				/>
				{#if showResetMembers}
					<Checkbox
						label="Retirer l'ancien référent du groupe de suivi."
						name="reset"
						bind:checked={resetMembers}
					/>
				{/if}
				{#if error}
					<Alert type="error" size="sm">Impossible de modifier le rattachement</Alert>
				{/if}
				<div class="pt-4">
					<Button type="submit">Rattacher</Button>
					<Button outline on:click={close}>Annuler</Button>
				</div>
			</LoaderIndicator>
		</form>
	</div>
</section>
