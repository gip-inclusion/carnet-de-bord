<script context="module" lang="ts">
	import { Select, Button } from '$lib/ui/base';
	import { ProBeneficiaryCreate, ProBeneficiaryCard, ProBeneficiarySearchBar } from '$lib/ui';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type {
		CreateBeneficiaryMutationStore,
		NotebookMember,
		SearchNotebookMemberQueryStore,
		SearchNotebookMemberQueryVariables,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import {
		SearchNotebookMemberDocument,
		CreateBeneficiaryDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import { operationStore, query } from '@urql/svelte';
	import { addMonths } from 'date-fns';

	function buildQueryVariables({ professionalId, search, selected }) {
		let visitDateStart: Date;
		let visitDateEnd: Date;

		const today = new Date();
		if (selected === threeMonths) {
			visitDateStart = addMonths(today, -3);
		} else if (selected === threeSixMonths) {
			visitDateStart = addMonths(today, -6);
			visitDateEnd = addMonths(today, -3);
		} else if (selected === sixTwelveMonths) {
			visitDateStart = addMonths(today, -12);
			visitDateEnd = addMonths(today, -6);
		} else if (selected === twelveMonths) {
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

	const threeMonths = '-3months';
	const threeSixMonths = '3-6months';
	const sixTwelveMonths = '6-12months';
	const twelveMonths = '+12months';

	export const load: Load = async ({ page, session }) => {
		const selected = threeMonths;
		const search = page.query.get('search');
		const { professionalId } = session.user;
		const queryVariables = buildQueryVariables({ professionalId, search, selected });
		const result = operationStore(SearchNotebookMemberDocument, queryVariables);
		const createBeneficiaryResult = operationStore(CreateBeneficiaryDocument);

		return {
			props: {
				result,
				search,
				createBeneficiaryResult,
				professionalId,
				selected,
			},
		};
	};
</script>

<script lang="ts">
	import { openComponent } from '$lib/stores';
	export let createBeneficiaryResult: CreateBeneficiaryMutationStore;
	export let result: SearchNotebookMemberQueryStore;
	export let search: string;
	export let professionalId: string;
	export let selected: string;

	query(result);

	function onSearch() {
		$result.variables = buildQueryVariables({ professionalId, search, selected });
		$result.reexecute();
	}

	function onSelect() {
		$result.variables = buildQueryVariables({ professionalId, search, selected });
		$result.reexecute();
	}

	function carnetUrl({ id }: { id: string }) {
		return `/pro/carnet/${id}`;
	}

	function addBeneficiary() {
		openComponent.open({ component: ProBeneficiaryCreate, props: { createBeneficiaryResult } });
	}

	/* TODO: find a way without cheating on that type */
	$: members = ($result.data ? $result.data.notebook_member : []) as NotebookMember[];
	$: notebooks = members ? members.map((m) => m.notebook) : [];
</script>

<div class="flex flex-col space-y-8 px-40">
	<div>
		<h1 class="fr-h2 float-left">Annuaire de mes bénéficiaires</h1>
	</div>
	<div class="flex flex-row w-full space-x-16">
		<div class="flex-grow">
			<Select
				on:select={onSelect}
				options={[
					{ name: threeMonths, label: 'dans les 3 derniers mois' },
					{ name: threeSixMonths, label: 'entre les 3 et 6 derniers mois' },

					{ name: sixTwelveMonths, label: 'entre les 6 et 12 derniers mois' },
					{ name: twelveMonths, label: 'il y a plus de 12 mois' },
				]}
				bind:selected
				selectHint="Sélectionner un filtre"
				selectLabel="Profils consultés..."
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
		{#if notebooks.length === 0}
			<div class="flex flex-col space-y-4 items-center">
				<div class="text-france-blue font-bold">
					Désolé, aucun bénéficiaire ne correspond à votre recherche.
				</div>
				<div>Veuillez cliquer sur le bouton ci-dessous pour ajouter un bénéficiaire.</div>
				<div class="pt-4">
					<Button on:click={addBeneficiary} iconSide="right">Ajouter un bénéficiaire</Button>
				</div>
			</div>
		{:else}
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
