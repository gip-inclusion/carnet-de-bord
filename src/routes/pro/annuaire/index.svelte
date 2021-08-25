<script context="module" lang="ts">
	import type { Option, TableHeader } from '$lib/ui/base/types';
	import { Select, Button, Table, Link } from '$lib/ui/base';
	import { ProBeneficiaryCard, ProBeneficiarySearchBar } from '$lib/ui';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type {
		Beneficiary,
		SearchBeneficiariesQueryStore
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { SearchBeneficiariesDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = async ({ page }) => {
		const search = page.query.get('search');
		const queryOptions = search
			? {
					filter: `%${search}%`
			  }
			: {};
		const result = operationStore(SearchBeneficiariesDocument, queryOptions);

		return {
			props: {
				result,
				search
			}
		};
	};
</script>

<script lang="ts">
	export let result: SearchBeneficiariesQueryStore;
	export let search: string;

	let selected: Option;

	query(result);

	function onSearch({ detail }) {
		const { search } = detail;
		$result.variables = { filter: `%${search}%` };
		$result.reexecute();
	}

	function onSelect({ detail }) {
		const { selected } = detail;
		$result.variables = { filter: `%${selected.name}%` };
		$result.reexecute();
	}

	function beneficiaryUrl({ id }: { id: string }) {
		return `/pro/beneficiaire/${id}`;
	}

	function addBeneficiary() {
		alert('Not implemented!');
	}

	let viewMode: 'list' | 'cards' = 'list';

	function toggleViewMode(vm: 'list' | 'cards') {
		viewMode = vm;
	}

	let headers: TableHeader<Beneficiary>[] = [
		{ id: 'name', label: 'Nom', getHtml: (b: Beneficiary) => `${b.firstname} ${b.lastname}` },
		{ id: 'dob', label: 'Date de naissance', getHtml: 'dateOfBirth' },
		{ id: 'phone', label: 'Numéro de téléphone', getHtml: 'mobileNumber' }
	];

	/* TODO: find a way without cheating on that type */
	$: beneficiaries = ($result.data ? $result.data.beneficiary : []) as Beneficiary[];
</script>

<div class="flex flex-col space-y-8 px-40">
	<div>
		<h1 class="fr-h2 float-left">Annuaire de mes bénéficiaires</h1>
		<div class="float-right align-middle">
			<Button
				on:click={() => toggleViewMode('cards')}
				outline={viewMode !== 'cards'}
				icon="ri-layout-grid-line"
			/>
			<Button
				on:click={() => toggleViewMode('list')}
				outline={viewMode !== 'list'}
				icon="ri-menu-line"
			/>
		</div>
	</div>

	<div class="flex flex-row w-full space-x-16">
		<div class="flex-grow">
			<Select
				disabled={true}
				on:select={onSelect}
				options={[
					{ name: '3months', label: 'Derniers profils consultés de moins de 3 mois' },
					{ name: '12months', label: 'Derniers profils consultés de moins de 12 mois' }
				]}
				bind:selected
				selectHint="Sélectionner un filtre"
				selectLabel="Filtrer par"
			/>
		</div>
		<div class="flex-grow">
			<!-- ugly AF, positioning needs to be done using align with tailwind or something else -->
			<div class="mb-2 flex-grow" style="user-select: none;">
				{' '}
			</div>
			<!-- end -->
			<ProBeneficiarySearchBar {search} on:search={(event) => onSearch(event)} size="md" />
		</div>
	</div>

	<LoaderIndicator {result}>
		{#if beneficiaries.length === 0}
			<div class="flex flex-col space-y-4 items-center">
				<div class="bf-500 font-bold">
					Désolé, aucun bénéficiaire ne correspond à votre recherche.
				</div>
				<div>Veuillez cliquer sur le bouton ci-dessous pour ajouter un bénéficiaire.</div>
				<div class="pt-4">
					<Button on:click={addBeneficiary} iconSide="right">Ajouter un bénéficiaire</Button>
				</div>
			</div>
		{:else}
			{#if viewMode === 'list'}
				<div class="flex flex-grow w-full">
					<Table {headers} rows={beneficiaries} captionText="Liste des bénéficiaires"
						><span slot="cellAction" let:slotData>
							<Link href={(() => beneficiaryUrl(slotData))()} classNames="bf-500 !shadow-none">
								<span aria-hidden="true" class="fr-fi-arrow-right-line" />
							</Link></span
						>
					</Table>
				</div>
			{:else}
				<div class="flex flex-row flex-wrap justify-between gap-1">
					{#each beneficiaries as beneficiary (beneficiary.id)}
						<div class="card-container">
							<ProBeneficiaryCard {beneficiary} href={beneficiaryUrl(beneficiary)} />
						</div>
					{/each}
				</div>
			{/if}
			<div>
				<Button outline={true} on:click={addBeneficiary}>Ajouter un nouveau bénéficiaire</Button>
			</div>
		{/if}
	</LoaderIndicator>
</div>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}

	.card-container {
		width: 49%;
		@apply py-2;
	}
</style>
