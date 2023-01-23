<script lang="ts">
	import { homeForRole } from '$lib/routes';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import Container from '$lib/ui/BeneficiaryList/Container.svelte';
	import {
		createSelectionStore,
		selectionContextKey,
	} from '$lib/ui/BeneficiaryList/MultipageSelectionStore';
	import { onDestroy, setContext } from 'svelte';
	import type { PageData } from './$types';
	import {
		BeneficiaryBoolExp,
		GetBeneficiariesDocument,
		GetBeneficiariesQuery,
		NotebookBoolExp,
		RoleEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import BeneficiaryListWithOrientation from '$lib/ui/BeneficiaryList/ListWithOrientation.svelte';
	import FilterOrientation from '$lib/ui/BeneficiaryList/FilterOrientation.svelte';

	import { operationStore, query } from '@urql/svelte';
	import { connectedUser, openComponent } from '$lib/stores';
	import type {
		BeneficiaryFilter,
		OrientedFilter,
	} from '$lib/ui/BeneficiaryList/OrientationFilter';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { pluralize } from '$lib/helpers';
	import Button from '$lib/ui/base/Button.svelte';
	import ChangeOrientationForm from '$lib/ui/OrientationRequest/ChangeOrientationForm.svelte';

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

	const graphqlBeneficiaryFilter = { members: { accountId: { _eq: $connectedUser.id } } };
	function getBeneficiaryFilter(filter: BeneficiaryFilter): NotebookBoolExp {
		switch (filter) {
			case 'mes-beneficiaires':
				return graphqlBeneficiaryFilter;
			case 'autres-beneficiaires':
				if (data.withoutOrientationManager) {
					return {
						_and: [
							{ _not: { members: { accountId: { _eq: $connectedUser.id } } } },
							{ _not: { members: { account: { orientation_manager: {} } } } },
						],
					};
				}
				return { _not: { members: { accountId: { _eq: $connectedUser.id } } } };
			default:
				return {};
		}
	}
	const graphqlOrientedFilter = { notebookInfo: { needOrientation: { _eq: true } } };
	function getOrientationStatusFilter(filter: OrientedFilter): NotebookBoolExp {
		switch (filter) {
			case 'non-oriente':
				return graphqlOrientedFilter;
			case 'oriente':
				return { _not: graphqlOrientedFilter };
			default:
				return {};
		}
	}

	function getWhereFilter(): BeneficiaryBoolExp {
		return {
			notebook: {
				_and: [
					getBeneficiaryFilter(data.beneficiaryFilter),
					getOrientationStatusFilter(data.orientationStatusFilter),
				],
			},
		};
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
				$result.reexecute();
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
	<FilterOrientation
		search={data.search}
		on:filter-update={updateOrientationFilter}
		orientationStatusFilter={data.orientationStatusFilter}
		beneficiaryFilter={data.beneficiaryFilter}
		withoutOrientationManager={data.withoutOrientationManager}
		slot="filter"
	/>
	<BeneficiaryListWithOrientation
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
