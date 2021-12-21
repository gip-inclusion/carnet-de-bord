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
	import { Text } from '$lib/ui/utils';

	export let result: OperationStore<GetAccountsSummaryQuery>;

	query(result);

	let accounts: GetAccountsSummaryQuery['accounts'];
	$: accounts = $result.data?.accounts || [];

	async function confirmAccount(id: string) {
		await post(`/manager/confirmPro`, { id });
		$result.reexecute({ requestPolicy: 'network-only' });
	}

	let emails: Record<string, undefined | 'ToConfirm' | 'Sending' | 'Failed' | 'Sent'> = {};

	async function sendConnectionEmail(id: string, confirm?: boolean) {
		if (!emails[id] || emails[id] === 'Failed') {
			if (typeof confirm === 'undefined') {
				emails[id] = 'ToConfirm';
			}
		} else if (emails[id] === 'ToConfirm') {
			if (confirm) {
				emails[id] = 'Sending';
				const response = await post(`/manager/sendConnectionEmail`, { id });
				if (response.ok) {
					emails[id] = 'Sent';
				} else {
					emails[id] = 'Failed';
				}
			} else {
				emails[id] = undefined;
			}
		}
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
		goto(`/manager/utilisateur/${id}`);
		return;
	}
</script>

<svelte:head>
	<title>Gestion des utilisateurs - carnet de bord</title>
</svelte:head>

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
					<th>Identifiant</th>
					<th>Compte</th>
					<th>Onboarding</th>
					<th>Email de connexion</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredAccounts as account (account.id)}
					<tr class="cursor-pointer">
						<td on:click={() => openProInfo(account)}>
							<Text value={account.professional.lastname} />
						</td>
						<td on:click={() => openProInfo(account)}>
							<Text value={account.professional.firstname} />
						</td>
						<td on:click={() => openProInfo(account)}>
							<Text value={account.professional.mobileNumber} />
						</td>
						<td on:click={() => openProInfo(account)}>
							<Text value={account.professional.structure.name} />
						</td>
						<td on:click={() => openProInfo(account)}>
							<Text value={account.username} />
						</td>
						<td>
							{#if !account.confirmed}
								<Button on:click={() => confirmAccount(account.id)}>Activer</Button>
							{:else}
								Actif
							{/if}
						</td>
						<td>
							<Text value={account.onboardingDone ? 'Fait' : 'Pas fait'} />
						</td>
						<td>
							{#if typeof emails[account.id] === 'undefined'}
								<Button
									on:click={() => sendConnectionEmail(account.id)}
									classNames="!bg-france-blue"
									icon="ri-mail-send-line"
									title="Envoyer un email de connexion"
								/>
							{:else if emails[account.id] === 'ToConfirm'}
								<div class="flex flex-row">
									<Button
										on:click={() => sendConnectionEmail(account.id, true)}
										classNames="!bg-success !pl-2 !pr-2"
										icon="ri-check-line"
										title="Confirmer l'envoi"
									/>
									<Button
										on:click={() => sendConnectionEmail(account.id, false)}
										classNames="!bg-marianne-red !pl-2 !pr-2"
										icon="ri-close-line"
										title="Annuler"
									/>
								</div>
							{:else if emails[account.id] === 'Sending'}
								<Button
									disabled={true}
									classNames="!bg-action"
									icon="ri-mail-send-fill"
									title="Envoi en cours..."
								/>
							{:else if emails[account.id] === 'Failed'}
								<Button
									on:click={() => sendConnectionEmail(account.id)}
									classNames="!bg-error"
									icon="ri-restart-line"
									title="Erreur ! Recommencer ?"
								/>
							{:else if emails[account.id] === 'Sent'}
								<Button
									disabled={true}
									classNames="!bg-success !text-white"
									icon="ri-mail-check-line"
									title="Envoyé !"
								/>
							{/if}
						</td>
					</tr>
				{:else}
					<tr class="shadow-sm">
						<td class="!text-center" colspan="4">Aucun compte utilisateur.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</LoaderIndicator>
