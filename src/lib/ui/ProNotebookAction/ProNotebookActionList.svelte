<script lang="ts">
	import { formatDateLocale } from '$lib/utils/date';
	import ProNotebookActionCreate from './ProNotebookActionCreate.svelte';

	type NotebookActionListType = {
		target: string;
		id: string;
		actions: Array<{
			id: string;
			createdAt: string;
			status: string;
			action: string;
			creator: { id: string; lastname: string; firstname: string };
		}>;
	};

	export let target: NotebookActionListType;
	export let theme: string;
</script>

<div class="pb-8">
	<div class={`w-full fr-table fr-table--layout-fixed`}>
		<table class="w-full">
			<thead>
				<tr>
					<th class="min-w-min w-3/5">Action</th>
					<th class="min-w-min">Créée par</th>
					<th class="min-w-min !text-right">Date de création</th>
				</tr>
			</thead>
			<tbody class="w-full">
				{#each target.actions as action (action.id)}
					<tr>
						<td>{action.action}</td>
						<td>
							<div>{action.creator.firstname}</div>
							<div>{action.creator.lastname}</div>
						</td>
						<td class="!text-right">{formatDateLocale(action.createdAt)} </td>
					</tr>
				{:else}
					<tr class="shadow-sm">
						<td class="!text-center" colspan="4"> Aucune action entreprise pour le moment. </td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div class="py-1">
		<ProNotebookActionCreate {target} {theme} />
	</div>
</div>
