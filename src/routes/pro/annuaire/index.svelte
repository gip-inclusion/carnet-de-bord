<script context="module" lang="ts">
	import type { Option } from '$lib/ui/base/types';
	import { Select, Button } from '$lib/ui/base';
	import { ProAddBeneficiaryLayer, ProBeneficiaryCard, ProBeneficiarySearchBar } from '$lib/ui';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type {
		CreateBeneficiaryMutationStore,
		NotebookMember,
		SearchNotebookMemberQueryStore,
		SearchNotebookMemberQueryVariables
	} from '$lib/graphql/_gen/typed-document-nodes';
	import {
		SearchNotebookMemberDocument,
		CreateBeneficiaryDocument
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import { operationStore, query } from '@urql/svelte';
	import { addMonths } from 'date-fns';

	export const load: Load = async ({ page, session }) => {
		const search = page.query.get('search');
		const { professionalId } = session.user;
		const queryVariables = {
			professionalId: professionalId,
			filter: search ? `%${search}%` : undefined
		};
		const result = operationStore(SearchNotebookMemberDocument, queryVariables);
		const createBeneficiaryResult = operationStore(CreateBeneficiaryDocument);

		return {
			props: {
				result,
				search,
				createBeneficiaryResult,
				professionalId
			}
		};
	};
</script>

<script lang="ts">
	import { offCanvas } from '$lib/stores';
	export let createBeneficiaryResult: CreateBeneficiaryMutationStore;
	export let result: SearchNotebookMemberQueryStore;
	export let search: string;
	export let professionalId: string;
	let isAddBeneficiaryOpen: boolean;

	let selected: Option;

	function buildQueryVariables() {
		let visitDateStart;
		let visitDateEnd;

		const today = new Date();
		if (selected?.name === '-3months') {
			visitDateStart = addMonths(today, -3);
		} else if (selected?.name === '3-6months') {
			visitDateStart = addMonths(today, -6);
			visitDateEnd = addMonths(today, -3);
		} else if (selected?.name === '6-12months') {
			visitDateStart = addMonths(today, -12);
			visitDateEnd = addMonths(today, -6);
		} else if (selected?.name === '+12months') {
			visitDateEnd = addMonths(today, -12);
		}

		const variables: SearchNotebookMemberQueryVariables = { professionalId };
		if (search) {
			variables.filter = `%${search}%`;
		}
		if (visitDateStart) {
			variables.visitDateStart = visitDateStart;
		}
		if (visitDateEnd) {
			variables.visitDateEnd = visitDateEnd;
		}
		return variables;
	}

	query(result);

	function onSearch() {
		$result.variables = buildQueryVariables();
		$result.reexecute();
	}

	function onSelect() {
		$result.variables = buildQueryVariables();
		$result.reexecute();
	}

	function carnetUrl({ id }: { id: string }) {
		return `/pro/carnet/${id}`;
	}

	function toggleAddBeneficiary() {
		isAddBeneficiaryOpen = !isAddBeneficiaryOpen;
		$offCanvas = isAddBeneficiaryOpen;
	}

	function addBeneficiary() {
		toggleAddBeneficiary();
	}

	// let viewMode: 'list' | 'cards' = 'list';

	// function toggleViewMode(vm: 'list' | 'cards') {
	// 	viewMode = vm;
	// }

	// let headers: TableHeader<Beneficiary>[] = [
	// 	{ id: 'name', label: 'Nom', getHtml: (b: Beneficiary) => `${b.firstname} ${b.lastname}` },
	// 	{ id: 'dob', label: 'Date de naissance', getHtml: 'dateOfBirth' },
	// 	{ id: 'phone', label: 'Numéro de téléphone', getHtml: 'mobileNumber' }
	// ];

	/* TODO: find a way without cheating on that type */
	$: members = ($result.data ? $result.data.notebook_member : []) as NotebookMember[];
	$: notebooks = members ? members.map((m) => m.notebook) : [];
</script>

<div class="flex flex-col space-y-8 px-40">
	<div>
		<h1 class="fr-h2 float-left">Annuaire de mes bénéficiaires</h1>
		<!-- <div class="float-right align-middle">
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
		</div> -->
	</div>

	<div class="flex flex-row w-full space-x-16">
		<div class="flex-grow">
			<Select
				on:select={onSelect}
				options={[
					{ name: '', label: '' },
					{ name: '-3months', label: 'dans les 3 derniers mois' },
					{ name: '3-6months', label: 'entre les 3 et 6 derniers mois' },
					{ name: '6-12months', label: 'entre les 6 et 12 derniers mois' },
					{ name: '+12months', label: 'il y a plus de 12 mois' }
				]}
				bind:selected
				selectHint="Sélectionner un filtre"
				selectLabel="Profils consultés"
			/>
		</div>
		<div class="flex-grow">
			<!-- ugly AF, positioning needs to be done using align with tailwind or something else -->
			<div class="mb-2 flex-grow" style="user-select: none;">
				{' '}
			</div>
			<!-- end -->
			<ProBeneficiarySearchBar bind:search on:search={() => onSearch()} size="md" />
		</div>
	</div>
	<LoaderIndicator {result}>
		<ProAddBeneficiaryLayer
			close={toggleAddBeneficiary}
			isOpen={isAddBeneficiaryOpen}
			{createBeneficiaryResult}
		/>
		{#if notebooks.length === 0}
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
			<!-- {#if viewMode === 'list'}
				<div class="flex flex-grow w-full">
					<Table {headers} rows={beneficiaries} captionText="Liste des bénéficiaires"
						><span slot="cellAction" let:slotData>
							<Link href={(() => beneficiaryUrl(slotData))()} classNames="bf-500 !shadow-none">
								<span aria-hidden="true" class="fr-fi-arrow-right-line" />
							</Link></span
						>
					</Table>
				</div>
			{:else} -->
			<div class="flex flex-row flex-wrap justify-between gap-1">
				{#each notebooks as notebook (notebook.id)}
					<div class="card-container">
						<ProBeneficiaryCard beneficiary={notebook.beneficiary} href={carnetUrl(notebook)} />
					</div>
				{/each}
			</div>
			<!-- {/if} -->
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
