<script lang="ts">
	import Container from '$lib/ui/BeneficiaryList/Container.svelte';
	import {
		createSelectionStore,
		selectionContextKey,
	} from '$lib/ui/BeneficiaryList/MultipageSelectionStore';
	import { onDestroy, setContext } from 'svelte';
	import type { PageData } from './$types';
	import {
		BeneficiaryBoolExp,
		GetBeneficiariesWithOrientationRequestDocument,
		GetBeneficiariesWithOrientationRequestQuery,
		NotebookBoolExp,
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

	const graphqlBeneficiaryFilter = { members: { accountId: { _eq: $connectedUser.id } } };
	function getBeneficiaryFilter(filter: BeneficiaryFilter): NotebookBoolExp {
		switch (filter) {
			case 'suivi':
				return graphqlBeneficiaryFilter;
			case 'non-suivi':
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
				if (data.withoutOrientationManager) {
					return { _not: { members: { account: { orientation_manager: {} } } } };
				}
				return {};
		}
	}
	const graphqlOrientedFilter = {
		members: { memberType: { _eq: 'referent' }, active: { _eq: true } },
	};
	function getOrientationStatusFilter(filter: OrientedFilter): NotebookBoolExp {
		switch (filter) {
			case 'sans-referent':
				return {
					_not: graphqlOrientedFilter,
					beneficiary: { structures: { status: { _eq: 'current' } } },
				};
			case 'sans-structure':
				return { _not: { beneficiary: { structures: { status: { _eq: 'current' } } } } };
			case 'referent':
				return graphqlOrientedFilter;
			case 'demande-reo':
				return { beneficiary: { orientationRequest: { decidedAt: { _is_null: true } } } };
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
	type Beneficiary = GetBeneficiariesWithOrientationRequestQuery['beneficiaries'][number];
	const selectionStore = setContext(selectionContextKey, createSelectionStore<Beneficiary>());

	const pageSize = 10;
	const result = operationStore(
		GetBeneficiariesWithOrientationRequestDocument,
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

		// reset filter when a user do a search
		if (data.search != event.detail.search) {
			urlParams.set('brsa', 'tous');
			urlParams.set('statut', 'tous');
			urlParams.set('co', 'sans');
		} else {
			urlParams.set('brsa', event.detail.beneficiaryFilter);
			urlParams.set('statut', event.detail.orientationStatusFilter);
			urlParams.set('co', event.detail.withoutOrientationManager ? 'avec' : 'sans');
		}

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
			members: beneficiary.notebook.referent,
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

<h1 class="fr-h2 fr-mt-6w">Bénéficiaires</h1>

<Container searchBeneficiariesResult={result} currentPage={data.currentPage}>
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
