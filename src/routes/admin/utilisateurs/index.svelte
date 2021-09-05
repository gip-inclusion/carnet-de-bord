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
				result
			}
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

<div class="flex flex-col gap-8 px-40">
	<LoaderIndicator {result}>
		<div>
			<h2 class="fr-h4 pt-4">Liste des accompagnateurs</h2>
			<div class="flex flex-column flex-wrap justify-between gap-2">
				{#each accounts as account (account.id)}
					<div class="flex gap-2 p-3 border-2 justify-between border-information w-full">
						<div class="flex flex-row gap-3">
							<div class="flex-column">
								<div class="text-information">Nom</div>
								<div>{account.professional.firstname} {account.professional.lastname}</div>
							</div>

							<div class="flex-column">
								<div class="text-information">Mobile:</div>
								<div>{account.professional.mobileNumber}</div>
							</div>

							<div class="flex-column">
								<div class="text-information">Structure:</div>
								<div>{account.professional.structure.name}</div>
							</div>
							<div class="flex-column">
								<div class="text-information">Compte:</div>
								<div>{account.confirmed ? 'actif' : 'à valider'}</div>
							</div>
						</div>
						{#if !account.confirmed}
							<Button on:click={() => confirmAccount(account.id)}>Valider ce compte</Button>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</LoaderIndicator>
</div>
