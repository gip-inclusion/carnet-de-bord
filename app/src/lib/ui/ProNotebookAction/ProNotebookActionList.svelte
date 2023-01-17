<script lang="ts">
	import { formatDateLocale } from '$lib/utils/date';

	import {
		type GetNotebookFocusByIdQuery,
		UpdateActionStatusDocument,
		type UpdateActionStatusMutation,
	} from '$lib/graphql/_gen/typed-document-nodes';

	import { type OperationStore, mutation, operationStore } from '@urql/svelte';
	import ProNotebookActionCreate from './ProNotebookActionCreate.svelte';
	import { Alert, Select } from '$lib/ui/base';
	import { ActionStatus } from '$lib/enums';
	import { displayFullName } from '../format';

	const statusValues = [
		{
			label: 'En cours',
			name: ActionStatus.InProgress,
		},
		{
			label: 'Réalisée',
			name: ActionStatus.Done,
		},
		{
			label: 'Abandonnée',
			name: ActionStatus.Abandoned,
		},
	];

	const updateNotebookActionResult = operationStore(UpdateActionStatusDocument);
	const updateNotebookAction = mutation(updateNotebookActionResult);
	let updateResult: OperationStore<UpdateActionStatusMutation>;

	let error: string;

	async function onChangeActionStatus(event: CustomEvent<{ selected: string }>, action_id: string) {
		updateResult = await updateNotebookAction({
			id: action_id,
			status: event.detail.selected,
		});

		if (updateResult.error) {
			error = "Erreur lors de la mise à jour de l'action.";
		}
	}

	export let target: GetNotebookFocusByIdQuery['focus']['targets'][0];
	export let theme: string;
</script>

<div class="pb-8">
	<div class={`w-full fr-table fr-table--layout-fixed`}>
		<table class="w-full">
			<caption class="sr-only">Actions en cours</caption>
			<thead>
				<tr>
					<th class="min-w-min">Action</th>
					<th class="min-w-min">Créée par</th>
					<th class="w-40">Statut</th>
					<th class="min-w-min !text-right">Date de création</th>
				</tr>
			</thead>
			<tbody class="w-full">
				{#each target.actions as action (action.id)}
					<tr>
						<td>{action.action}</td>
						<td>
							{#if action.creator}
								{displayFullName(action.creator.professional || action.creator.orientation_manager)}
							{/if}
						</td>
						<td
							><Select
								options={statusValues}
								selected={action.status}
								selectLabel=""
								on:select={(event) => onChangeActionStatus(event, action.id)}
							/>
						</td><td class="!text-right">{formatDateLocale(action.createdAt)} </td>
					</tr>
				{:else}
					<tr class="shadow-sm">
						<td class="!text-center" colspan="3"> Aucune action entreprise pour le moment. </td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if error}
		<div class="mb-8">
			<Alert type="error" description={error} />
		</div>
	{/if}
	<div class="py-1">
		<ProNotebookActionCreate {target} {theme} />
	</div>
</div>
