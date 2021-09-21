<script lang="ts">
	import type { Maybe } from '$lib/graphql/_gen/typed-document-nodes';
	import { formatDateLocale } from '$lib/utils/date';
	import ProNotebookActionCreate from './ProNotebookActionCreate.svelte';

	type NotebookActionListType = {
		target: string;
		id: any;
		actions: Array<{
			id: any;
			creationDate: any;
			status: string;
			action: string;
			structure: { id: any; name?: Maybe<string> };
			creator: { id: any; lastname: string; firstname: string };
		}>;
	};

	export let target: NotebookActionListType;
</script>

<div class="pb-8">
	<div class={`w-full fr-table fr-table--layout-fixed`}>
		<table class="w-full">
			<thead>
				<tr>
					<th>Action</th>
					<th>Créée par</th>
					<th>Structure sollicitée</th>
					<th>Date de création</th>
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
						<td>{action.structure.name} </td>
						<td>{formatDateLocale(action.creationDate)} </td>
					</tr>
				{:else}
					<tr class="shadow-sm">
						<td class="!text-center" colspan="4"> Aucune action entreprise pour le moment. </td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<ProNotebookActionCreate {target} />
</div>
