<script lang="ts">
	import type {
		GetBeneficiariesQuery,
		GetBeneficiariesWithOrientationRequestQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';

	import { getContext } from 'svelte';
	import Pagination from '../Pagination.svelte';
	import { LoaderIndicator } from '../utils';

	import { type SelectionStore, selectionContextKey } from './MultipageSelectionStore';

	import type { OperationStore } from '@urql/svelte';

	type Beneficiary =
		| GetBeneficiariesQuery['beneficiaries'][number]
		| GetBeneficiariesWithOrientationRequestQuery['beneficiaries'][number];

	export let searchBeneficiariesResult: OperationStore<
		GetBeneficiariesQuery | GetBeneficiariesWithOrientationRequestQuery
	>;
	// global filter
	export let currentPage: number;

	const pageSize = 10;

	const selectionStore = getContext<SelectionStore<Beneficiary>>(selectionContextKey);

	$: nbBeneficiaries =
		$searchBeneficiariesResult.data?.search_beneficiaries_aggregate.aggregate.count ?? 0;
	$: nbSelectedBeneficiaries = Object.keys($selectionStore).length;
</script>

<div class="flex flex-col gap-8">
	<slot name="filter" />
	<LoaderIndicator result={searchBeneficiariesResult}>
		<slot name="list" />
		<div class="flex justify-center">
			<Pagination {currentPage} {pageSize} count={nbBeneficiaries} />
		</div>
	</LoaderIndicator>
	{#if nbSelectedBeneficiaries > 0}
		<slot name="batch-action" />
	{/if}
</div>
