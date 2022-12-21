<script lang="ts">
	import type { MemberFilter } from './Filters.svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { GetBeneficiariesQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import {
		type BeneficiaryBoolExp,
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

	import { type SelectionStore, selectionContextKey } from './MultipageSelectionStore';
	import { pluralize } from '$lib/helpers';
	import Button from '$lib/ui/base/Button.svelte';
	import { connectedUser, openComponent } from '$lib/stores';
	import AddProfessionnalForm from './AddProfessionnalForm.svelte';
	import AddStructureProfessionnalForm from './AddStructureProfessionnalForm.svelte';
	import FilterOrientation from './FilterOrientation.svelte';
	import type { BeneficiaryFilter, OrientedFilter } from './OrientationFilter';

	type BeneficiaryListType = 'orientation' | 'manager' | 'structure';

	// global filter
	export let currentPage: number;
	export let search: string;

	// structure / manager filter
	export let filter: MemberFilter | null = null;
	export let member: string | null = null;

	// orientation filter
	export let beneficiaryFilter: BeneficiaryFilter | null = null;
	export let orientationStatusFilter: OrientedFilter | null = null;
	export let withoutOrientationManager: boolean | null = null;

	export let structureId: string = null;
	export let listType: BeneficiaryListType = 'manager';

	const pageSize = 10;

	type Beneficiary = GetBeneficiariesQuery['beneficiaries'][0];

	function getWhereFilter(): BeneficiaryBoolExp {
		const graphqlFilter: BeneficiaryBoolExp = {
			notebook: {
				_and: [
					...((beneficiaryFilter === 'autres-beneficiaires' && [
						{ _not: { members: { accountId: { _eq: $connectedUser.id } } } },
						...((withoutOrientationManager && [
							{
								_not: { members: { account: { orientation_manager: {} } } },
							},
						]) ||
							[]),
					]) ||
						[]),
					...((beneficiaryFilter === 'mes-beneficiaires' && [
						{ members: { accountId: { _eq: $connectedUser.id } } },
					]) ||
						[]),
					...((orientationStatusFilter === 'oriente' && [
						{ _not: { notebookInfo: { needOrientation: { _eq: true } } } },
					]) ||
						[]),
					...((orientationStatusFilter === 'non-oriente' && [
						{ notebookInfo: { needOrientation: { _eq: true } } },
					]) ||
						[]),
				],
				...(member && {
					members: {
						active: { _eq: true },
						account: {
							_or: [
								{ professional: { email: { _eq: member } } },
								{ orientation_manager: { email: { _eq: member } } },
							],
						},
					},
				}),
			},
		};

		if (filter === 'noMember') {
			if (structureId) {
				graphqlFilter.structures = {
					status: { _neq: 'outdated' },
					structureId: { _eq: structureId },
				};
				graphqlFilter.notebook = {
					_not: {
						members: {
							active: { _eq: true },
							account: { professional: { structureId: { _eq: structureId } } },
						},
					},
				};
			} else {
				graphqlFilter.notebook = {
					_not: { members: { active: { _eq: true }, memberType: { _eq: 'referent' } } },
				};
			}
		}
		if (filter === 'withMember') {
			if (structureId) {
				graphqlFilter.notebook = {
					members: {
						active: { _eq: true },
						account: { professional: { structureId: { _eq: structureId } } },
					},
				};
			} else {
				graphqlFilter.notebook.members = {
					active: { _eq: true },
					memberType: { _eq: 'referent' },
				};
			}
		}
		return graphqlFilter;
	}

	const result = operationStore(
		GetBeneficiariesDocument,
		{
			search: search,
			offset: (currentPage - 1) * pageSize,
			limit: pageSize,
			where: getWhereFilter(),
		},
		{
			additionalTypenames: ['beneficiary', 'notebook_member', 'notebook_info'],
			requestPolicy: 'cache-and-network',
		}
	);

	query(result);

	const unsub = page.subscribe(() => {
		$result.variables = {
			search,
			offset: (currentPage - 1) * pageSize,
			limit: pageSize,
			where: getWhereFilter(),
		};
		$result.reexecute();
	});

	onDestroy(unsub);

	const selectionStore = getContext<SelectionStore<Beneficiary>>(selectionContextKey);

	function updateFilters(
		event: CustomEvent<{ resetMember: boolean; filter: MemberFilter; search: string }>
	) {
		// We should not mutate the $page.url.searchParams AND use goto
		// since it make unreliable behaviour
		// so we create a new URL object to process our new params and then
		// use it for goto.
		const urlParams = new URLSearchParams([...$page.url.searchParams.entries()]);
		urlParams.set('filter', event.detail.filter);
		urlParams.set('search', event.detail.search);
		if (event.detail.resetMember) {
			urlParams.delete('member');
		}
		urlParams.set('page', '1');
		goto(`?${urlParams.toString()}`);
		selectionStore.reset();
	}

	function updateOrientationFilter(
		event: CustomEvent<{
			orientationStatusFilter: OrientedFilter;
			withoutOrientationManager: boolean;
			beneficiaryFilter: BeneficiaryFilter;
			search;
		}>
	) {
		const urlParams = new URLSearchParams([...$page.url.searchParams.entries()]);
		urlParams.set(
			'brsa',
			event.detail.beneficiaryFilter === 'mes-beneficiaires' ? 'suivi' : 'non-suivi'
		);
		urlParams.set('oriente', event.detail.orientationStatusFilter === 'oriente' ? 'oui' : 'non');
		urlParams.set('co', event.detail.withoutOrientationManager ? 'avec' : 'sans');
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
	$: nbBeneficiaries = $result.data?.search_beneficiaries_aggregate.aggregate.count ?? 0;
	$: nbSelectedBeneficiaries = Object.keys($selectionStore).length;
</script>

<div class="flex flex-col gap-8">
	{#if listType === 'orientation'}
		<FilterOrientation
			{search}
			on:filter-update={updateOrientationFilter}
			{orientationStatusFilter}
			{beneficiaryFilter}
			{withoutOrientationManager}
		/>
	{:else}
		<BeneficiaryFilterView {filter} {search} on:filter-update={updateFilters} {member} />
	{/if}
	<LoaderIndicator {result}>
		{#if listType === 'manager'}
			<BeneficiaryListWithStructure beneficiaries={$result.data.beneficiaries} />
		{:else if listType === 'structure'}
			<BeneficiaryList beneficiaries={$result.data.beneficiaries} {structureId} />
		{:else if listType === 'orientation'}
			<BeneficiaryListWithOrientation beneficiaries={$result.data.beneficiaries} />
		{/if}
		<div class="flex justify-center">
			<Pagination {currentPage} {pageSize} count={nbBeneficiaries} />
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
