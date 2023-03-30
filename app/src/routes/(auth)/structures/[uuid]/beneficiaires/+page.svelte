<script lang="ts">
	import { homeForRole } from '$lib/routes';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import {
		createSelectionStore,
		selectionContextKey,
	} from '$lib/ui/BeneficiaryList/MultipageSelectionStore';
	import Container from '$lib/ui/BeneficiaryList/Container.svelte';
	import { onDestroy, setContext } from 'svelte';
	import { operationStore, query } from '@urql/svelte';
	import {
		BeneficiaryBoolExp,
		GetBeneficiariesDocument,
		GetBeneficiariesQuery,
		GetStructureDocument,
		RoleEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type { PageData } from './$types';
	import BeneficiaryFilterView, { MemberFilter } from '$lib/ui/BeneficiaryList/Filters.svelte';
	import BeneficiaryList from '$lib/ui/BeneficiaryList/List.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/ui/base/Button.svelte';
	import { openComponent } from '$lib/stores';
	import AddProfessionnalForm from '$lib/ui/BeneficiaryList/AddProfessionnalForm.svelte';
	import { pluralize } from '$lib/helpers';

	export let data: PageData;

	const getStructure = operationStore(GetStructureDocument, { structureId: data.structureId });
	query(getStructure);

	$: structure = $getStructure.data?.structure_by_pk;

	$: breadcrumbs = [
		{
			name: 'accueil',
			path: homeForRole(RoleEnum.AdminStructure),
			label: 'Accueil',
		},
		{
			name: 'structure',
			path: `${homeForRole(RoleEnum.AdminStructure)}/${data.structureId}`,
			label: `${structure?.name ?? ''}`,
		},
		{
			name: 'bénéficiaires',
			path: '',
			label: `Bénéficiaires`,
		},
	];

	const notebookFilter = {
		members: {
			active: { _eq: true },
			memberType: { _eq: 'referent' },
		},
	};

	function getWhereFilter(): BeneficiaryBoolExp {
		if (data.member) {
			return {
				notebook: {
					members: {
						active: { _eq: true },
						account: { professional: { email: { _eq: data.member } } },
					},
				},
			};
		}
		if (data.filter === 'all') {
			return {
				structures: { status: { _eq: 'current' }, structureId: { _eq: data.structureId } },
			};
		}
		if (data.filter === 'noMember') {
			return {
				structures: {
					status: { _eq: 'current' },
					structureId: { _eq: data.structureId },
				},
				notebook: {
					_not: {
						...notebookFilter,
					},
				},
			};
		}
		if (data.filter === 'withMember') {
			return {
				structures: {
					status: { _eq: 'current' },
					structureId: { _eq: data.structureId },
				},
				notebook: notebookFilter,
			};
		}
	}
	type Beneficiary = GetBeneficiariesQuery['beneficiaries'][0];

	const selectionStore = setContext(selectionContextKey, createSelectionStore<Beneficiary>());
	const pageSize = 10;
	const result = operationStore(
		GetBeneficiariesDocument,
		{
			search: data.search,
			offset: (data.currentPage - 1) * pageSize,
			limit: pageSize,
			where: getWhereFilter(),
		},
		{
			additionalTypenames: ['beneficiary', 'notebook_member', 'notebook_info'],
			requestPolicy: 'cache-and-network',
		}
	);

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

	query(result);
	const unsub = page.subscribe(() => {
		$result.variables = {
			search: data.search,
			offset: (data.currentPage - 1) * pageSize,
			limit: pageSize,
			where: getWhereFilter(),
		};
		$result.reexecute();
	});

	onDestroy(unsub);

	function openEditLayer() {
		const selectedBeneficiaries = Object.values($selectionStore);
		const notebooks = selectedBeneficiaries.map((beneficiary) => ({
			id: beneficiary.notebook.id,
			beneficiaryId: beneficiary.id,
			members: beneficiary.notebook.members,
		}));

		const props = {
			notebooks,
			structureId: data.structureId,
			onBeneficiaryOrientationChanged: () => {
				selectionStore.reset();
				$result.reexecute();
			},
		};
		openComponent.open({
			component: AddProfessionnalForm,
			props,
		});
	}
	$: nbSelectedBeneficiaries = Object.keys($selectionStore).length;
</script>

<svelte:head>
	<title>Liste des bénéficiaires - Carnet de bord</title>
</svelte:head>
<Breadcrumbs segments={breadcrumbs} />
<h1>Bénéficiaires</h1>
<Container searchBeneficiariesResult={result} currentPage={data.currentPage}>
	<BeneficiaryFilterView
		slot="filter"
		filter={data.filter}
		search={data.search}
		on:filter-update={updateFilters}
		member={data.member}
	/>

	<BeneficiaryList
		slot="list"
		structureId={data.structureId}
		beneficiaries={$result.data.beneficiaries}
		on:beneficiary-orientation-changed={() => $result.reexecute()}
	/>
	<div slot="batch-action" class="flex gap-8 items-center">
		<span class="fr-text--bold fr-text-label--blue-france"
			>{nbSelectedBeneficiaries} {pluralize('sélectionné', nbSelectedBeneficiaries)}</span
		>
		<div class="flex gap-4">
			<Button on:click={openEditLayer}>Rattacher</Button>
			<Button outline on:click={() => selectionStore.reset()}>Annuler</Button>
		</div>
	</div>
</Container>
