<script lang="ts">
	import {
		GetNotebookByBeneficiaryIdQuery,
		DenyOrientationRequestDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { mutation, operationStore } from '@urql/svelte';
	import { Button } from '$lib/ui/base';
	export let orientationRequest: GetNotebookByBeneficiaryIdQuery['notebook'][0]['beneficiary']['orientationRequest'][0];

	const updateStore = operationStore(DenyOrientationRequestDocument);
	const denyOrientationRequest = mutation(updateStore);

	async function confirmOrientationRequestDenial() {
		await denyOrientationRequest({ id: orientationRequest.id });
		openComponent.close();
	}

	function cancelOrientationRequestDenial() {
		openComponent.close();
	}
</script>

<section>
	<div class="pb-8">
		<h1>Maintenir l'accompagnement</h1>
		<p class="mb-0">Êtes-vous sûr de vouloir maintenir l'accompagnement ?</p>
	</div>

	<div class="flex flex-row gap-6 mt-12">
		<Button on:click={confirmOrientationRequestDenial}>Oui</Button>
		<Button outline={true} on:click={cancelOrientationRequestDenial}>Annuler</Button>
	</div>
</section>
