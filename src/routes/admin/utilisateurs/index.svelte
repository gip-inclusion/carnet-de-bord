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
	import { Button, SearchBar } from '$lib/ui/base';
	import { stringsMatch } from '$lib/helpers';
	import { goto } from '$app/navigation';

	export let result: OperationStore<GetAccountsSummaryQuery>;

	query(result);

	let accounts: GetAccountsSummaryQuery['accounts'];
	$: accounts = $result.data?.accounts || [];

	async function confirmAccount(id: string) {
		await post(`/admin/confirmPro`, { id });
		$result.reexecute({ requestPolicy: 'network-only' });
	}

	let search = '';
	let search2 = '';

	function filterAccount(accs: GetAccountsSummaryQuery['accounts'], s: string | null) {
		const matcher = stringsMatch(s);
		return accs.filter(
			({ professional }) =>
				!!professional &&
				((professional.firstname && matcher(professional.firstname)) ||
					(professional.lastname && matcher(professional.lastname)) ||
					(professional.email && matcher(professional.email)) ||
					(professional.mobileNumber &&
						matcher(
							professional.mobileNumber
								.replace(' ', '')
								.replace('.', '')
								.replace('-', '')
								.replace('/', '')
						)))
		);
	}

	function handleSubmit() {
		search2 = search;
	}

	$: filteredAccounts = filterAccount(accounts, search2);

	function openProInfo({ id }: GetAccountsSummaryQuery['accounts'][0]) {
		goto(`/admin/utilisateur/${id}`);
		return;
	}
</script>

<div class="py-4 px-40 space-y-4">
	<LoaderIndicator {result}>
		<SearchBar
			bind:search
			inputLabel="Rechercher un compte"
			inputHint="Nom, prénom, email, téléphone"
			btnLabel="Rechercher"
			{handleSubmit}
		/>
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
					{#each filteredAccounts as account (account.id)}
						<tr class="cursor-pointer" on:click={() => openProInfo(account)}>
							<td>{account.professional.lastname}</td>
							<td>{account.professional.firstname}</td>
							<td>{account.professional.mobileNumber}</td>
							<td>{account.professional.structure.name}</td>
							<td>
								{#if !account.confirmed}
									<Button on:click={() => confirmAccount(account.id)}>activer</Button>
								{:else}
									Actif
								{/if}
							</td>
						</tr>
					{:else}
						<tr class="shadow-sm">
							<td class="!text-center" colspan="4"> Aucun compte utilisateur. </td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</LoaderIndicator>
</div>
