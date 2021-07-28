<script context="module" lang="ts">
	import type { OperationStore } from '@urql/svelte';
	import type {
		Beneficiary,
		UpdateNotebookVisitDateMutation
	} from '$lib/_gen/typed-document-nodes';
	import { UpdateNotebookVisitDateDocument } from '$lib/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page }) => {
		const id = page.params.uuid;
		const result = operationStore(UpdateNotebookVisitDateDocument, {
			beneficiaryId: id,
			notebookVisitDate: new Date()
		});
		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	export let result: OperationStore<UpdateNotebookVisitDateMutation, Beneficiary>;

	query(result);
</script>

{#if $result.data?.update_notebook_member.returning[0].notebook.beneficiary.lastname}
	<div>{result.data?.update_notebook_member.returning[0].notebook.beneficiary.lastname}</div>
{/if}
