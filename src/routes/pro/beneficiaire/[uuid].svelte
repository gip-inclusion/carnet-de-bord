<script context="module" lang="ts">
	import type { OperationStore } from '@urql/svelte';
	import type { Beneficiary, GetBeneficiaryByIdQuery } from '$lib/_gen/typed-document-nodes';
	import { GetBeneficiaryByIdDocument } from '$lib/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page }) => {
		const id = page.params.uuid;
		const result = operationStore(GetBeneficiaryByIdDocument, { id });
		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	export let result: OperationStore<GetBeneficiaryByIdQuery, Beneficiary>;

	query(result);
</script>

{#if $result.data?.beneficiary_by_pk}
	<div>{result.data.beneficiary_by_pk.lastname}</div>
{/if}
