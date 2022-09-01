<script context="module" lang="ts">
	import { post } from '$lib/utils/post';
	import {
		GetAccountsSummaryQuery,
		Professional,
		RoleEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { GetAccountsSummaryDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import { OperationStore, query } from '@urql/svelte';
	import { operationStore } from '@urql/svelte';
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
	import { Button, IconButton } from '$lib/ui/base';
	import { displayFullName } from '$lib/ui/format';
	import { Text } from '$lib/ui/utils';
	export let result: OperationStore<GetAccountsSummaryQuery>;

	query(result);

	let accounts: AccountSummary[];
	$: accounts = $result.data?.accounts.map(toList) || [];

	async function confirmAccount(id: string) {
		await post(`/manager/confirmPro`, { id });
		$result.reexecute({ requestPolicy: 'network-only' });
	}

	let emails: Record<string, undefined | 'ToConfirm' | 'Sending' | 'Failed' | 'Sent'> = {};

	type AccountSummary = Pick<Professional, 'id' | 'email' | 'firstname' | 'lastname'> & {
		type: RoleEnum;
		structure: string;
		confirmed: boolean;
		onboardingDone: boolean;
		phoneNumber: string;
		nbBeneficiaries: number;
	};

	function toList(account: GetAccountsSummaryQuery['accounts'][0]): AccountSummary {
		if (account.type === RoleEnum.Professional) {
			const { id } = account;
			const { firstname, lastname, email, structure, mobileNumber } = account.professional;
			return {
				id,
				firstname,
				lastname,
				email,
				structure: structure.name,
				phoneNumber: mobileNumber,
				type: account.type,
				confirmed: account.confirmed,
				onboardingDone: account.onboardingDone,
				nbBeneficiaries: account.notebookCount.aggregate.count,
			};
		} else if (account.type === RoleEnum.OrientationManager) {
			const { id, firstname, lastname, email, phoneNumbers } = account.orientation_manager;
			return {
				id,
				firstname,
				lastname,
				email,
				structure: null,
				phoneNumber: phoneNumbers,
				type: account.type,
				confirmed: account.confirmed,
				onboardingDone: account.onboardingDone,
				nbBeneficiaries: account.notebookCount.aggregate.count,
			};
		}
	}

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

	function getAccountTypeLabel(type: RoleEnum): string | null {
		if (type === RoleEnum.Professional) {
			return 'Accompagnant';
		}
		if (type === RoleEnum.OrientationManager) {
			return "Chargé d'orientation";
		}
		return null;
	}
</script>

<svelte:head>
	<title>Gestion des professionnels - Carnet de bord</title>
</svelte:head>

<LoaderIndicator {result}>
	<div class={`w-full fr-table fr-table--layout-fixed fr-mt-6w`}>
		<table>
			<caption class="sr-only">Liste des professionnels</caption>
			<thead>
				<tr>
					<th>Prénom Nom</th>
					<th>Type</th>
					<th>Téléphone</th>
					<th>Structure</th>
					<th>Email</th>
					<th>Compte</th>
					<th>bénéficiaires</th>
					<th>Onboarding</th>
					<th class="text-center">Email de connexion</th>
				</tr>
			</thead>
			<tbody>
				{#each accounts as account (account.id)}
					<tr>
						<td>
							<Text value={displayFullName(account)} />
						</td>
						<td>{getAccountTypeLabel(account.type)}</td>
						<td>
							<Text value={account.phoneNumber} />
						</td>
						<td>
							<Text value={account.structure} />
						</td>
						<td class="break-words">
							<Text value={account.email} />
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
						<td class="text-right">
							<p
								class="fr-badge"
								class:fr-badge--brown-caramel={account.nbBeneficiaries === 0}
								class:fr-badge--blue-ecume={account.nbBeneficiaries > 0}
							>
								{account.nbBeneficiaries}
							</p>
						</td>
						<td class="text-center">
							{#if account.confirmed}
								{#if typeof emails[account.id] === 'undefined'}
									<IconButton
										icon="fr-icon-mail-line"
										on:click={() => sendConnectionEmail(account.id)}
										title="Envoyer un email de connexion"
										class="fr-btn--sm fr-btn--tertiary fr-btn--tertiary-no-outline "
									>
										Envoyer un email de connexion
									</IconButton>
								{:else if emails[account.id] === 'ToConfirm'}
									<div class="flex flex-row">
										<IconButton
											on:click={() => sendConnectionEmail(account.id, true)}
											icon="fr-icon-check-line"
											title="Confirmer l'envoi"
										/>
										<IconButton
											on:click={() => sendConnectionEmail(account.id, false)}
											icon="fr-icon-close-line"
											class="bg-marianne-red"
											title="Annuler"
										/>
									</div>
								{:else if emails[account.id] === 'Sending'}
									<IconButton
										icon="fr-icon-mail-fill"
										class="bg-action"
										title="Envoi en cours..."
									/>
								{:else if emails[account.id] === 'Failed'}
									<IconButton
										on:click={() => sendConnectionEmail(account.id)}
										icon="fr-icon-refresh-line"
										class="bg-error"
										title="Erreur ! Recommencer ?"
									/>
								{:else if emails[account.id] === 'Sent'}
									<IconButton icon="fr-icon-checkbox-line" class="bg-success" title="Envoyé !" />
								{/if}
							{/if}
						</td>
					</tr>
				{:else}
					<tr class="shadow-sm">
						<td class="!text-center" colspan="8">Aucun compte utilisateur.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</LoaderIndicator>
