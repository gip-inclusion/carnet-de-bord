<script lang="ts">
	import type { GetDeploymentsQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import type { OperationStore } from '@urql/svelte';
	import { displayFullName } from '$lib/ui/format';
	import { LoaderIndicator } from '$lib/ui/utils';

	export let deploymentsStore: OperationStore<GetDeploymentsQuery>;

	$: deployments = $deploymentsStore.data?.deployments.map(({ __typename, ...rest }) => ({
		...rest,
	}));
</script>

<LoaderIndicator result={deploymentsStore}>
	<div class={`w-full fr-table fr-table--layout-fixed`}>
		<table>
			<thead>
				<tr>
					<th>Déploiement</th>
					<th>Responsable(s)</th>
				</tr>
			</thead>
			<tbody>
				{#each deployments as deployment (deployment.id)}
					<tr>
						<td><a href={`/admin/deployment/${deployment.id}`}>{deployment.label}</a></td>
						<td>
							{deployment.managers.map((manager) => displayFullName(manager)).join(', ')}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</LoaderIndicator>
