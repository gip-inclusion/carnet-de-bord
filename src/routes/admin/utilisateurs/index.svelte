<script context="module" lang="ts">
	import { post } from '$lib/utils/post';
	import type { GetAccountsSummaryQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetAccountsSummaryDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	export const load: Load = async () => {
		const result = operationStore(GetAccountsSummaryDocument, {});

		return {
			props: {
				result,
			},
		};
	};
</script>

<script lang="ts">
	import { Button } from '$lib/ui/base';

	export let result: OperationStore<GetAccountsSummaryQuery>;

	query(result);

	$: accounts = $result.data?.accounts;

	async function confirmAccount(id: string) {
		await post(`/admin/confirmPro`, { id });
		$result.reexecute({ requestPolicy: 'network-only' });
	}
</script>

<div class="py-4 px-40">
	<LoaderIndicator {result}>
		<div class={`w-full fr-table fr-table--layout-fixed`}>
			<table>
				<thead>
					<tr>
						<th>Nom</th>
						<th>Prénom</th>
						<th>Mobile</th>
						<th>Structure</th>
						<th>Compte</th>
					</tr>
				</thead>
				<tbody>
					{#each accounts as account (account.id)}
						<tr>
							<td>{account.professional.lastname}</td>
							<td>{account.professional.firstname}</td>
							<td>{account.professional.mobileNumber}</td>
							<td>{account.professional.structure.name}</td>
							{#if !account.confirmed}
								<td><Button on:click={() => confirmAccount(account.id)}>activer</Button></td>
							{:else}
								<td>Actif</td>
							{/if}
						</tr>
					{:else}
						<tr class="shadow-sm">
							<td class="!text-center" colspan="4"> Aucune action entreprise pour le moment. </td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</LoaderIndicator>
</div>
