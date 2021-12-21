<script lang="ts">
	import {
		InsertStructureDocument,
		InsertStructureMutation,
		InsertStructureMutationVariables,
		UpdateStructureDocument,
		UpdateStructureMutation,
		UpdateStructureMutationVariables,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type { Structure, StructureRequest } from '$lib/types';
	import { Alert, Button } from '$lib/ui/base';
	import { operationStore, mutation } from '@urql/svelte';
	import type { OperationStore } from '@urql/svelte';
	import * as RD from '$lib/remoteData';

	import { Input, Form } from '$lib/ui/forms';
	import { structureInputSchema } from '$lib/ui/structure.schema';
	import { openComponent } from '$lib/stores';
	import { filterFalsyProps } from '$lib/helpers';

	export let structure: StructureRequest;
	export let structureId: string | null = null;

	const updateStore: OperationStore<
		UpdateStructureMutation,
		UpdateStructureMutationVariables,
		Structure
	> = operationStore(UpdateStructureDocument);
	const insertStore: OperationStore<
		InsertStructureMutation,
		InsertStructureMutationVariables,
		Structure
	> = operationStore(InsertStructureDocument);
	const updater = mutation(updateStore);
	const inserter = mutation(insertStore);
	let mutationResult: RD.RemoteData<Structure, string> = RD.notAsked;

	insertStore.subscribe((result) => {
		if (result.data) {
			mutationResult = RD.success(result.data);
		}
		if (result.error) {
			const err = result.error.toString();
			mutationResult = RD.failure(err);
		}
	});
	updateStore.subscribe((result) => {
		if (result.data) {
			mutationResult = RD.success(result.data);
		}
		if (result.error) {
			const err = result.error.toString();
			mutationResult = RD.failure(err);
		}
	});

	async function handleSubmit(values) {
		mutationResult = RD.loading;
		if (structureId) {
			updater({ ...filterFalsyProps(values), id: structureId });
		} else {
			inserter({ ...filterFalsyProps(values) });
		}
	}

	async function handleCancel() {
		openComponent.close();
	}
</script>

<div class="w-full">
	{#if RD.getData(mutationResult)}
		<div role="status">
			<h2 class="text-france-blue fr-h4 pt-8 px-8">
				{structureId ? 'Modification' : 'Création'} d'une structure
			</h2>
			<div class="w-full p-8">
				<Alert type="success" description={'La structure a été enregistrée avec succès !'} />
			</div>
			<div class="w-full px-8">
				<Button on:click={handleCancel}>J'ai compris</Button>
			</div>
		</div>
	{:else}
		<h2 class="text-france-blue fr-h4 pt-8 px-8">
			{structureId ? 'Modification' : 'Création'} d'une structure
		</h2>
		<Form
			initialValues={{ ...structure }}
			validationSchema={structureInputSchema}
			onSubmit={handleSubmit}
			class="w-full px-8 pb-8"
			let:isSubmitted
			let:isSubmitting
			let:isValid
		>
			<Input inputLabel="Nom" placeholder="Mission locale de Crest" name="name" required />
			<Input inputLabel="Téléphone" placeholder="0123456789" name="phone" class="max-w-max" />
			<Input inputLabel="Courriel" placeholder="crest@mission-locale.fr" name="email" />
			<Input
				inputLabel="Adresse"
				placeholder="55-57 rue du Faubourg Saint-Honoré"
				name="address1"
				required
			/>
			<Input inputLabel="Adresse (complément)" placeholder="1er étage" name="address2" />
			<div class="fr-grid-row fr-grid-row--gutters ">
				<Input
					class="fr-col-3 max-w-max"
					inputLabel="Code postal"
					placeholder="75008"
					name="postalCode"
					required
				/>
				<Input class="fr-col-9" inputLabel="Ville" placeholder="Paris" name="city" required />
			</div>
			<Input
				inputLabel="Site internet"
				placeholder="https://www.mission-locale.fr/crest"
				name="website"
			/>
			<Input inputLabel="Siret" placeholder="123 456 789 0123" name="siret" />
			<Input
				inputLabel="Description"
				placeholder="Antenne de Crest de la Mission locale Auvergne Rhône-Alpes"
				name="shortDesc"
			/>

			{#if RD.getError(mutationResult)}
				<div class="mb-8">
					<Alert type="error" description={RD.getError(mutationResult)} />
				</div>
			{/if}
			<div class="flex flex-row gap-6 mt-12">
				<Button type="submit" disabled={(isSubmitted && !isValid) || isSubmitting}
					>Enregistrer</Button
				>
				<Button outline={true} on:click={handleCancel}>Annuler</Button>
			</div>
		</Form>
	{/if}
</div>
