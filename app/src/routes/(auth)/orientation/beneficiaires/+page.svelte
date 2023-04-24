<script lang="ts">
	import Container from '$lib/ui/BeneficiaryList/Container.svelte';
	import {
		createSelectionStore,
		selectionContextKey,
	} from '$lib/ui/BeneficiaryList/MultipageSelectionStore';
	import { onDestroy, setContext } from 'svelte';
	import type { PageData } from './$types';
	import type {
		BeneficiaryBoolExp,
		GetBeneficiariesWithOrientationRequestQuery,
		NotebookBoolExp,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { GetBeneficiariesWithOrientationRequestDocument } from '$lib/graphql/_gen/typed-document-nodes';
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
	import {
		FOLLOWED_BRSA_PARAM_NAME,
		ORIENTATION_STATUS_PARAM_NAME,
		RSA_RIGHT_AND_DUTY_PARAM_NAME,
		WITH_ORIENTATION_MANAGER_PARAM_NAME,
	} from './url_params';

	export let data: PageData;

	const graphqlBeneficiaryFilter = {
		members: { active: { _eq: true }, accountId: { _eq: $connectedUser.id } },
	};

	function getBeneficiaryFilter(filter: BeneficiaryFilter): NotebookBoolExp {
		switch (filter) {
			case 'suivi':
				return graphqlBeneficiaryFilter;
			case 'non-suivi':
				if (data.withoutOrientationManager) {
					return {
						_and: [
							{
								_not: { members: { active: { _eq: true }, account: { orientation_manager: {} } } },
							},
						],
					};
				}
				return {
					_not: { members: { active: { _eq: true }, accountId: { _eq: $connectedUser.id } } },
				};
			default:
				if (data.withoutOrientationManager) {
					return {
						_not: { members: { active: { _eq: true }, account: { orientation_manager: {} } } },
					};
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

	function getRightandDutyFilter() {
		if (data.rsaRightAndDuty) {
			return { beneficiary: { subjectToRightAndDuty: { _eq: true } } };
		}
		return {};
	}

	function getWhereFilter(): BeneficiaryBoolExp {
		return {
			notebook: {
				_and: [
					getBeneficiaryFilter(data.beneficiaryFilter),
					getOrientationStatusFilter(data.orientationStatusFilter),
					getRightandDutyFilter(),
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
			rsaRightAndDuty: boolean;
			beneficiaryFilter: BeneficiaryFilter;
			search;
		}>
	) {
		const urlParams = new URLSearchParams([...$page.url.searchParams.entries()]);

		// reset filter when a user do a search
		if (data.search != event.detail.search) {
			urlParams.set(FOLLOWED_BRSA_PARAM_NAME, 'tous');
			urlParams.set(ORIENTATION_STATUS_PARAM_NAME, 'tous');
			urlParams.set(WITH_ORIENTATION_MANAGER_PARAM_NAME, 'sans');
			urlParams.delete(RSA_RIGHT_AND_DUTY_PARAM_NAME);
		} else {
			urlParams.set(FOLLOWED_BRSA_PARAM_NAME, event.detail.beneficiaryFilter);
			urlParams.set(ORIENTATION_STATUS_PARAM_NAME, event.detail.orientationStatusFilter);
			urlParams.set(
				WITH_ORIENTATION_MANAGER_PARAM_NAME,
				event.detail.withoutOrientationManager ? 'avec' : 'sans'
			);
		}
		if (event.detail.rsaRightAndDuty) {
			urlParams.set(RSA_RIGHT_AND_DUTY_PARAM_NAME, 'oui');
		} else {
			urlParams.delete(RSA_RIGHT_AND_DUTY_PARAM_NAME);
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
		rsaRightAndDuty={data.rsaRightAndDuty}
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
		<span class="fr-text--bold fr-text-label--blue-france"
			>{nbSelectedBeneficiaries} {pluralize('sélectionné', nbSelectedBeneficiaries)}</span
		>
		<div class="flex gap-4">
			<Button on:click={openEditLayer}>Rattacher</Button>
			<Button outline on:click={() => selectionStore.reset()}>Annuler</Button>
		</div>
	</div>
</Container>
