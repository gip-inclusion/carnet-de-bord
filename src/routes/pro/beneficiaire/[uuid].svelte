<script context="module" lang="ts">
	import type { OperationStore } from '@urql/svelte';
	import type { Beneficiary, GetNotebookQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetNotebookDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page }) => {
		const id = page.params.uuid;
		const result = operationStore(GetNotebookDocument, {
			beneficiaryId: id
		});
		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	import type { Option } from '$lib/ui/base/types';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { Button, Select, SearchBar, Table } from '$lib/ui/base';
	import { displayFullName, displayMobileNumber, displayFullAddress } from '$lib/ui/format';
	export let result: OperationStore<GetNotebookQuery, Beneficiary>;

	query(result);

	$: beneficiary = $result.data?.notebook[0].beneficiary as Beneficiary;

	let search = '';
	let selectedPeriod: Option | null;
	let periodOptions = [];
	let selectedOrder: Option | null;
	let orderOptions = [];
</script>

<LoaderIndicator {result}>
	<div class="flex flex-col space-y-8 px-40">
		<div class="flex flex-col space-y-2">
			<div class="flex flex-col">
				<div class="mb-2">Informations mises à jour le 5 juillet par Sarah Courci</div>
				<div>
					<h1 class="fr-h2 float-left bf-500">
						{displayFullName(beneficiary)}
					</h1>
					<div class="float-right align-middle">
						<Button
							disabled={true}
							on:click={() => alert('Not implemented!')}
							outline={true}
							icon="ri-printer-line"
						/>
						<Button
							disabled={true}
							on:click={() => alert('Not implemented!')}
							outline={true}
							icon="ri-edit-line"
						/>
					</div>
				</div>
				<div>Né le {beneficiary.dateOfBirth}</div>
			</div>
			<!-- extract Infos -->
			<div class="flex flex-row">
				<div class="flex flex-col w-7/12 space-y-4">
					<div class="w-full">
						<h3 class="text-lg bf-500 mb-none">{displayMobileNumber(beneficiary)}</h3>
						<div>{beneficiary.email}</div>
						<div>
							{displayFullAddress(beneficiary)}
						</div>
					</div>
					<div class="w-full">
						<h4 class="text-base mb-none">Identifiant Pôle emploi</h4>
						<div>Non renseigné</div>
					</div>
					<div class="w-full">
						<h4 class="text-base mb-none">Identifiant CAF</h4>
						<div>Non renseigné</div>
					</div>
				</div>
				<div class="flex flex-col w-5/12 space-y-4">
					<div class="flex flex-row">
						<div class="w-full">
							<h3 class="text-lg bf-500 mb-none">Situation</h3>
							<div>Non renseigné</div>
						</div>
						<div class="w-full">
							<h3 class="text-lg bf-500 mb-none">Sujet du CER</h3>
							<div>Non renseigné</div>
						</div>
					</div>
					<div class="flex flex-row">
						<div class="w-full">
							<h3 class="text-lg bf-500 mb-none">Mes droits</h3>
							<div>Non renseigné</div>
						</div>
					</div>
				</div>
			</div>
			<!-- extract Infos -->
		</div>
		<!-- extract Groupe de suivi -->
		<div class="flex flex-col">
			<h2 class="fr-h4 bf-500">Groupe de suivi</h2>
			<div class="flex flex-row w-full justify-between">
				<Button disabled={true} on:click={() => alert('Not implemented!')}
					>Ajouter un accompagnateur
				</Button>
				<SearchBar {search} size="md" inputHint="Nom, fonction, structure" />
			</div>
			<!-- @TODO find a way to make Table generically-typed; does not seem obvious -->
			<Table headers={[]} rows={[]} captionText="Groupe de suivi" captionPosition="none" />
		</div>
		<!-- extract Groupe de suivi -->
		<!-- extract Historique des démarches -->
		<div class="flex flex-col">
			<h2 class="fr-h4 bf-500">Historique des démarches</h2>
			<div class="flex flex-row w-full justify-between">
				<Button disabled={true} on:click={() => alert('Not implemented!')}
					>Ajouter une étape
				</Button>
				<div class="flex flex-row justify-between space-x-4">
					<Select
						disabled={true}
						selected={selectedPeriod}
						options={periodOptions}
						selectLabel=""
						selectHint="Sélectionner une période"
					/>
					<Select
						disabled={true}
						selected={selectedOrder}
						options={orderOptions}
						selectLabel=""
						selectHint="Sélectionner un tri"
					/>
				</div>
			</div>
		</div>
		<!-- extract Historique des démarches -->
	</div>
</LoaderIndicator>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}

	.mb-none {
		margin-bottom: 0 !important;
	}
</style>
