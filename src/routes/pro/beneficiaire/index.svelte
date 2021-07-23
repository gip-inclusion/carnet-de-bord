<script context="module" lang="ts">
	import type { OperationStore } from '@urql/svelte';
	import type { Beneficiary, UpdateLastSeenDateMutation } from '$lib/_gen/typed-document-nodes';
	import { UpdateLastSeenDateDocument } from '$lib/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page }) => {
		const teamMemberId = page.query.get('teamMemberId');
		const result = operationStore(UpdateLastSeenDateDocument, {
			id: teamMemberId,
			lastSeenDate: new Date()
		});
		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	export let result: OperationStore<UpdateLastSeenDateMutation, Beneficiary>;

	query(result);
</script>

{#if $result.data?.update_team_member_by_pk.beneficiary.lastname}
	<div>{result.data?.update_team_member_by_pk.beneficiary.lastname}</div>
{/if}
