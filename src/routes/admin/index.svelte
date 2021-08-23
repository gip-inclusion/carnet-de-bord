<script context="module" lang="ts">
	import { post } from '$lib/utils/post';
	import { displayFullName } from '$lib/ui/format';
	import type { GetAccountsSummaryQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetAccountsSummaryDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { Button, Card } from '$lib/ui/base';

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
	export let result: OperationStore<GetAccountsSummaryQuery>;

	query(result);

	$: ({ proConfirmed, proUnconfirmed, beneficiaryConfirmed, beneficiaryUnconfirmed } = $result.data
		? $result.data
		: {
				proConfirmed: [],
				proUnconfirmed: [],
				beneficiaryConfirmed: [],
				beneficiaryUnconfirmed: []
		  });

	let inFlight = false;

	async function confirmAccount(id: string) {
		if (!inFlight) {
			inFlight = true;
			const { protocol, host } = window.location;
			await post(`/admin/confirmPro`, { id, appUrl: `${protocol}//${host}` });
			inFlight = false;
			$result.reexecute({ requestPolicy: 'network-only' });
		}
	}

	/* example auto-refresh
	function autoRefresh() {
		setTimeout(() => {
			if (!inFlight) {
				$result.reexecute({ requestPolicy: 'network-only' });
			}
			autoRefresh();
		}, 2000);
	}

	autoRefresh();
	*/
</script>

<div class="flex flex-col gap-8 px-40">
	<h1 class="fr-h2">Espace Administrateur</h1>
	<LoaderIndicator {result}>
		<div>
			<h2 class="fr-h4">Demandes de compte accompagnateur</h2>
			<div class="flex flex-row flex-wrap justify-between gap-4">
				{#each proUnconfirmed as request (request.id)}
					<div class="card-container">
						<Card hideArrow={true} detail={`Compte #${request.id}`}>
							<span slot="title">
								{displayFullName(request.professional)}
							</span>
							<span slot="description">
								<div>
									Structure : <span class="font-bold"
										>{request.professional.structure.name || ' - '}</span
									>
								</div>
								<div>
									Fonction : {@html request.professional.position || '<em>Non renseigné</em>'}
								</div>
								<div class="mt-4">
									<Button disabled={inFlight} on:click={() => confirmAccount(request.id)}
										>Confirmer</Button
									>
								</div>
							</span>
						</Card>
					</div>
				{:else}
					Aucune demande de création de compte accompagnateur en attente.
				{/each}
			</div>
		</div>
		<div>
			<h2 class="fr-h4">Comptes accompagnateur</h2>
			<div class="flex flex-row flex-wrap justify-between gap-4">
				{#each proConfirmed as account (account.id)}
					<div class="card-container">
						<Card hideArrow={true} detail={`Compte #${account.id}`}>
							<span slot="title">
								{displayFullName(account.professional)}
							</span>
							<span slot="description">
								<div>
									Structure : <span class="font-bold"
										>{account.professional.structure.name || ' - '}</span
									>
								</div>
								<div>
									Fonction : {@html account.professional.position || '<em>Non renseigné</em>'}
								</div>
							</span>
						</Card>
					</div>
				{:else}
					Aucun compte accompagnateur.
				{/each}
			</div>
		</div>
		<div>
			<h2 class="fr-h4">Demandes de compte bénéficiaire</h2>
			<div>
				{#each beneficiaryUnconfirmed as request (request.id)}
					<p>{request.id}</p>
				{:else}
					Aucune demande de création de compte bénéficiaire en attente.
				{/each}
			</div>
		</div>
		<div>
			<h2 class="fr-h4">Comptes bénéficiaire</h2>
			<div class="flex flex-row flex-wrap justify-between gap-4">
				{#each beneficiaryConfirmed as account (account.id)}
					<div class="card-container">
						<Card hideArrow={true} detail={`Compte #${account.id}`}>
							<span slot="title">
								{displayFullName(account.beneficiary)}
							</span>
						</Card>
					</div>
				{:else}
					Aucun compte bénéficiaire.
				{/each}
			</div>
		</div>
	</LoaderIndicator>
</div>

<style lang="postcss">
	.card-container {
		width: 49%;
	}
</style>
