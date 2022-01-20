<script lang="ts">
	import { UpdateNotebookActionDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { RemoteDataC as RD } from '$lib/remoteData';

	import { mutation, operationStore } from '@urql/svelte';
	import { Button } from '$lib/ui/base';
	import Alert from '$lib/ui/base/Alert.svelte';
	import Text from '$lib/ui/utils/Text.svelte';
	import type { SvelteEventHandler } from '$lib/types';

	type NotebooksResult = {
		id: string;
		beneficiary: {
			firstname: string;
			lastname: string;
		};
	};

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
	const selectAll: SvelteEventHandler<HTMLInputElement> = function selectAll(event) {
		if (event.currentTarget.checked) {
			selectedItems = notebooks.reduce((state, { id }) => ({ ...state, [id]: true }), {});
		} else {
			selectedItems = notebooks.reduce((state, { id }) => ({ ...state, [id]: false }), {});
		}
	};
	$: checked =
		Object.values(selectedItems).filter((field) => Boolean(field)).length === notebooks.length;
	$: nbItemToUpdate = Object.values(selectedItems).filter((field) => Boolean(field)).length;
	$: successfullUpdate = Object.values(updatedNotebooks).filter(
		(value) => value === 'success'
	).length;
</script>

<div class="flex flex-col gap-4">
	{#if status === RD.Success}
		<Alert
			type={successfullUpdate > 0 ? 'success' : 'error'}
			title={`${successfullUpdate || 'Aucun'}
		carnet${successfullUpdate > 1 ? 's' : ''}
		mis à jour
		sur ${Object.values(updatedNotebooks).length}
		demandé${Object.values(updatedNotebooks).length > 1 ? 's' : ''}.`}
		/>
	{/if}
	{#if status === RD.Loading}
		<Alert
			type="info"
			title={`Mise à jour ${
				Object.values(updatedNotebooks).length > 1 ? 'des carnets' : 'du carnet'
			} en cours...`}
		/>
	{/if}
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
				<th />
				<th class="text-left">Prénom Nom</th>
				<th class="w-2/6">Status</th>
			</tr>
		</thead>
		<tbody class="bg-white divide-y divide-gray-300">
			{#each notebooks as notebook}
				<tr>
					<td class="align-middle w-2">
						<div class="fr-checkbox-group py-3">
							<input
								disabled={status !== RD.NotAsked}
								type="checkbox"
								bind:checked={selectedItems[notebook.id]}
								id={`cb-${notebook.id}`}
								name="toUpdate"
							/>
							<label for={`cb-${notebook.id}`}>
								&nbsp;
								<span class="sr-only">
									{notebook.beneficiary.firstname}
									{notebook.beneficiary.lastname}
								</span>
							</label>
						</div>
					</td>
					<td>
						<label class="fr-label" for={`cb-${notebook.id}`}>
							{notebook.beneficiary.firstname}
							{notebook.beneficiary.lastname}
						</label>
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
								<Text classNames="text-error" value={'Erreur de mise a jour'} />
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
	{#if status !== RD.Success}
		<Button disabled={nbItemToUpdate === 0 || status === RD.Loading} on:click={udpateNotebooks}>
			Mettre à jour
		</Button>
	{/if}
</div>
