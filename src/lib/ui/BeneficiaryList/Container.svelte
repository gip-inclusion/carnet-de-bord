<script lang="ts">
	import type { MemberFilter } from './Filters.svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { GetBeneficiariesQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import {
		BeneficiaryBoolExp,
		GetBeneficiariesDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';

	import { operationStore, query } from '@urql/svelte';
	import { getContext, onDestroy } from 'svelte';
	import Pagination from '../Pagination.svelte';
	import { LoaderIndicator } from '../utils';

	import BeneficiaryFilterView from './Filters.svelte';
	import BeneficiaryList from '$lib/ui/BeneficiaryList/List.svelte';
	import BeneficiaryListWithStructure from '$lib/ui/BeneficiaryList/ListWithStructure.svelte';
	import BeneficiaryListWithOrientation from '$lib/ui/BeneficiaryList/ListWithOrientation.svelte';

	import { selectionContextKey, SelectionStore } from './MultipageSelectionStore';
	import { pluralize } from '$lib/helpers';
	import Button from '$lib/ui/base/Button.svelte';
	import { openComponent } from '$lib/stores';
	import AddProfessionnalForm from './AddProfessionnalForm.svelte';
	import AddStructureProfessionnalForm from './AddStructureProfessionnalForm.svelte';

	type BeneficiaryListType = 'orientation' | 'manager' | 'structure';

	export let search: string;
	export let filter: MemberFilter;
	export let currentPage: number;

	export let structureId: string = null;
	export let listType: BeneficiaryListType = 'manager';

	const pageSize = 10;

	type Beneficiary = GetBeneficiariesQuery['beneficiaries'][0];

	function getWithMemberFilter(filter: MemberFilter): BeneficiaryBoolExp {
		if (filter === 'noMember') {
			return { notebook: { _not: { members: {} } } };
		}
		if (filter === 'withMember') {
			return { notebook: { members: {} } };
		}
		return { notebook: {} }; // prevent beenficiary without notebook
	}

	const result = operationStore(
		GetBeneficiariesDocument,
		{
			search: search,
			offset: (currentPage - 1) * pageSize,
			limit: pageSize,
			withMembers: getWithMemberFilter(filter),
		},
		{
			additionalTypenames: ['beneficiary', 'notebook_member', 'beneficiary_info'],
			requestPolicy: 'cache-and-network',
		}
	);

	query(result);

	const unsub = page.subscribe(() => {
		$result.variables = {
			search,
			offset: (currentPage - 1) * pageSize,
			limit: pageSize,
			withMembers: getWithMemberFilter(filter),
		};
		$result.reexecute();
	});

	onDestroy(unsub);

	const selectionStore = getContext<SelectionStore<Beneficiary>>(selectionContextKey);

	function updateFilters(event: CustomEvent<{ filter: MemberFilter; search: string }>) {
		// We should not mutate the $page.url.searchParams AND use goto
		// since it make unreliable behaviour
		// so we create a new URL object to process our new params and then
		// use it for goto.
		const urlParams = new URLSearchParams([...$page.url.searchParams.entries()]);
		urlParams.set('filter', event.detail.filter);
		urlParams.set('search', event.detail.search);
		urlParams.set('page', '1');
		goto(`?${urlParams.toString()}`);
		selectionStore.reset();
	}

	function getEditComponent(type: BeneficiaryListType) {
		if (['orientation', 'manager'].includes(listType)) {
			return AddStructureProfessionnalForm;
		}
		if (type === 'structure') {
			return AddProfessionnalForm;
		}
	}

	function getEditComponentProps(type: BeneficiaryListType, structuresId: string[]) {
		if (['orientation', 'manager'].includes(listType)) {
			return { structuresId: [...new Set(structuresId)] };
		}
		if (type === 'structure') {
			return { structureId: new Set(structuresId).values().next().value };
		}
	}

	function openEditLayer() {
		const selectedBeneficiaries = Object.values($selectionStore);
		const notebooks = selectedBeneficiaries.map((beneficiary) => ({
			notebookId: beneficiary.notebook.id,
			beneficiaryId: beneficiary.id,
		}));

		const structuresId = selectedBeneficiaries.flatMap((beneficiary) =>
			beneficiary.structures.map(({ structure }) => structure.id)
		);

		const members = selectedBeneficiaries.flatMap((beneficiary) =>
			beneficiary.notebook.members.map((member) => member.account?.id)
		);
		const memberSet = new Set(members);
		let member = null;
		if (
			memberSet.size === 1 &&
			selectedBeneficiaries.filter((beneficiary) => beneficiary.notebook.members.length > 0)
				.length === selectedBeneficiaries.length
		) {
			// all selected beneficiaries have the same pro as referent
			// so we preselect member in the pro list
			member = memberSet.values().next().value;
		}
		openComponent.open({
			component: getEditComponent(listType),
			props: {
				notebooks,
				member: member,
				showResetMembers: memberSet.size > 0,
				...getEditComponentProps(listType, structuresId),
				onClose: () => {
					selectionStore.reset();
				},
			},
		});
	}

	$: nbSelectedBeneficiaries = Object.keys($selectionStore).length;
</script>

<div class="flex flex-col gap-8">
	<BeneficiaryFilterView {filter} {search} on:filter-update={updateFilters} />
	<LoaderIndicator {result}>
		{#if listType === 'manager'}
			<BeneficiaryListWithStructure beneficiaries={$result.data.beneficiaries} />
		{:else if listType === 'structure'}
			<BeneficiaryList beneficiaries={$result.data.beneficiaries} {structureId} />
		{:else if listType === 'orientation'}
			<BeneficiaryListWithOrientation beneficiaries={$result.data.beneficiaries} />
		{/if}
		<div class="flex justify-center">
			<Pagination
				{currentPage}
				{pageSize}
				count={$result.data.search_beneficiaries_aggregate.aggregate.count}
			/>
		</div>
	</LoaderIndicator>
	{#if nbSelectedBeneficiaries > 0}
		<div class="flex gap-8 items-center">
			<span class="fr-text--bold fr-text-label--blue-france "
				>{nbSelectedBeneficiaries} {pluralize('sélectionné', nbSelectedBeneficiaries)}</span
			>
			<div class="flex gap-4">
				<Button on:click={openEditLayer}>Rattacher</Button>
				<Button outline on:click={() => selectionStore.reset()}>Annuler</Button>
			</div>
		</div>
	{/if}
</div>
