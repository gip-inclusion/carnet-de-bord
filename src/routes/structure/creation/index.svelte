<script context="module" lang="ts">
	import type { GetStructuresQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetStructuresDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = async () => {
		const result = operationStore(GetStructuresDocument, {});

		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import type { StructureRequest } from '$lib/types';

	import StructureFormInfo from '$lib/ui/StructureFormInfo.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	let structure: StructureRequest = {};
	let fieldErrors: StructureRequest = {};
	let requestStep: 'start' | 'success' | 'error' = 'start';

	export let result: OperationStore<GetStructuresQuery>;

	function resetForm() {
		requestStep = 'start';
	}

	function handleCancel() {
		goto('/inscription');
	}
</script>

<div class="flex flex-col gap-8 px-40 mt-8">
	<LoaderIndicator {result}>
		<div>
			<h1>Soumettre une nouvelle structure</h1>
			<p>Votre demande fera l’objet d’une validation par l’administrateur du Carnet de bord.</p>
		</div>
		<div>
			<h2 class="bf-500 fr-h4">Identification de la structure</h2>
			<StructureFormInfo
				{structure}
				disabled={false}
				{fieldErrors}
				confirmText="Soumettre ma structure"
				onInput={resetForm}
				on:cancel={handleCancel}
			/>
		</div>
	</LoaderIndicator>
</div>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}
</style>
