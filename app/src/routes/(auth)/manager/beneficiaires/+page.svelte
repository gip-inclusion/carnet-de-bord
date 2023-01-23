<script lang="ts">
	import { homeForRole } from '$lib/routes';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import {
		createSelectionStore,
		selectionContextKey,
	} from '$lib/ui/BeneficiaryList/MultipageSelectionStore';
	import Container from '$lib/ui/BeneficiaryList/Container.svelte';
	import { onDestroy, setContext } from 'svelte';
	import type { PageData } from './$types';
	import {
		BeneficiaryBoolExp,
		GetBeneficiariesDocument,
		GetBeneficiariesQuery,
		RoleEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import BeneficiaryFilterView, { MemberFilter } from '$lib/ui/BeneficiaryList/Filters.svelte';
	import BeneficiaryListWithStructure from '$lib/ui/BeneficiaryList/ListWithStructure.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { openComponent } from '$lib/stores';
	import ChangeOrientationForm from '$lib/ui/OrientationRequest/ChangeOrientationForm.svelte';
	import { pluralize } from '$lib/helpers';
	import Button from '$lib/ui/base/Button.svelte';

	export let data: PageData;

	const breadcrumbs = [
		{
			name: 'accueil',
			path: homeForRole(RoleEnum.Manager),
			label: 'Accueil',
		},
		{
			name: 'structure',
			path: '',
			label: `bénéficiaires`,
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
						account: {
							_or: [
								{ professional: { email: { _eq: data.member } } },
								{ orientation_manager: { email: { _eq: data.member } } },
							],
						},
					},
				},
			};
		}

		if (data.filter === 'noMember') {
			return {
				notebook: {
					_not: notebookFilter,
				},
			};
		}
		if (data.filter === 'withMember') {
			return { notebook: notebookFilter };
		}
		return { notebook: {} };
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
			onBeneficiaryOrientationChanged: () => {
				selectionStore.reset();
				result.reexecute();
			},
		};
		openComponent.open({
			component: ChangeOrientationForm,
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
<Container resultStore={result} currentPage={data.currentPage}>
	<BeneficiaryFilterView
		slot="filter"
		filter={data.filter}
		search={data.search}
		on:filter-update={updateFilters}
		member={data.member}
	/>

	<BeneficiaryListWithStructure
		slot="list"
		beneficiaries={$result.data.beneficiaries}
		on:beneficiary-orientation-changed={() => $result.reexecute()}
	/>
	<div slot="batch-action" class="flex gap-8 items-center">
		<span class="fr-text--bold fr-text-label--blue-france "
			>{nbSelectedBeneficiaries} {pluralize('sélectionné', nbSelectedBeneficiaries)}</span
		>
		<div class="flex gap-4">
			<Button on:click={openEditLayer}>Rattacher</Button>
			<Button outline on:click={() => selectionStore.reset()}>Annuler</Button>
		</div>
	</div>
</Container>
