<script lang="ts">
	import { UpdateNotebookActionDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { RemoteDataC as RD } from '$lib/remoteData';

	import { mutation, operationStore } from '@urql/svelte';
	import { Button } from '../base';
	import Text from '../utils/Text.svelte';

	type NotebooksResult = {
		id: string;
		beneficiary: {
			firstname: string;
			lastname: string;
		};
	};

	export let deploymentId: string;
	export let notebooks: NotebooksResult[];

	const updateActionStore = operationStore(UpdateNotebookActionDocument);
	const updater = mutation(updateActionStore);

	async function udpateNotebooks() {
		status = RD.Loading;

		for (const [id] of Object.entries(selectedItems).filter(([, selected]) => selected)) {
			const { error } = await updater({ id });
			if (error) {
				updatedNotebooks[id] = error;
			} else {
				updatedNotebooks[id] = 'success';
			}
		}

		status = RD.Success;
	}
	let status = RD.NotAsked;
	let updatedNotebooks = {};

	let selectedItems = notebooks.reduce((state, { id }) => ({ ...state, [id]: false }), {});
	function selectAll(event) {
		if (event.target.checked) {
			selectedItems = notebooks.reduce((state, { id }) => ({ ...state, [id]: true }), {});
		} else {
			selectedItems = notebooks.reduce((state, { id }) => ({ ...state, [id]: false }), {});
		}
	}
	$: checked = Object.values(selectedItems).filter(Boolean).length === notebooks.length;
	$: nbItemToUpdate = Object.values(selectedItems).filter(Boolean).length;
</script>

<table summary={`${notebooks.length} carnets`} class="w-full divide-y divide-gray-300">
	<thead>
		<tr>
			<td colspan="3" class=" py-4">
				<div class="fr-checkbox-group ">
					<input
						disabled={status !== RD.NotAsked}
						type="checkbox"
						{checked}
						on:change={selectAll}
						id="cb-select-all"
						name="selectAll"
					/>
					<label class="fr-label" for="cb-select-all"> Tout sélectionner </label>
				</div>
			</td>
		</tr>
		<tr>
			<th class="text-left">Prénom Nom</th>
			<th class="w-2/6">Status</th>
		</tr>
	</thead>
	<tbody class="bg-white divide-y divide-gray-300">
		{#each notebooks as notebook}
			<tr>
				<td class="align-middle ">
					<div class="fr-checkbox-group py-3">
						<input
							disabled={status !== RD.NotAsked}
							type="checkbox"
							bind:checked={selectedItems[notebook.id]}
							id={`cb-${notebook.id}`}
							name="toUpdate"
						/>
						<label class="fr-label" for={`cb-${notebook.id}`}>
							{notebook.beneficiary.firstname}
							{notebook.beneficiary.lastname}
						</label>
					</div>
				</td>
				<td class="text-center">
					{#if Object.prototype.hasOwnProperty.call(updatedNotebooks, notebook.id)}
						{#if updatedNotebooks[notebook.id] === 'success'}
							<span
								class="fr-fi-checkbox-circle-fill text-success"
								aria-hidden="true"
								style="margin: 0 50%;"
							/>
						{:else}
							<Text classNames="text-error" value={'erreur de mise a jour'} />
						{/if}
					{:else if status === RD.Loading}
						<span
							class="ri-loader-2-fill text-gray-dark"
							aria-hidden="true"
							style="margin: 0 50%;"
						/>
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
{#if status === RD.Success}
	<p>
		{Object.values(updatedNotebooks).filter((value) => value === 'success').length}/{Object.keys(
			updatedNotebooks
		).length}
		Carnets mise à jour
		{#if Object.values(updatedNotebooks).filter((value) => value === 'success').length > 0}
			(dont {Object.values(updatedNotebooks).filter((value) => value !== 'success').length} erreurs)
		{/if}
	</p>
{:else}
	<Button disabled={nbItemToUpdate === 0 || status === RD.Loading} on:click={udpateNotebooks}>
		mettre à jour
	</Button>
{/if}
