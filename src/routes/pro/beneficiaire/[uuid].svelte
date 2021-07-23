<script context="module" lang="ts">
	import type { OperationStore } from '@urql/svelte';
	import type { Beneficiary, UpdateLastVisitDateMutation } from '$lib/_gen/typed-document-nodes';
	import { UpdateLastVisitDateDocument } from '$lib/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page }) => {
		const id = page.params.uuid;
		const result = operationStore(UpdateLastVisitDateDocument, {
			beneficiaryId: id,
			lastVisitDate: new Date()
		});
		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	export let result: OperationStore<UpdateLastVisitDateMutation, Beneficiary>;

	query(result);
</script>

{#if $result.data?.update_team_member.returning[0].beneficiary.lastname}
	<div>{result.data?.update_team_member.returning[0].beneficiary.lastname}</div>
{/if}
