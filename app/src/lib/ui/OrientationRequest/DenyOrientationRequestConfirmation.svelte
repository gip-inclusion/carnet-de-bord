<script lang="ts">
	import type { GetNotebookByBeneficiaryIdQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';
	import { postApiJson } from '$lib/utils/post';
	import Alert from '../base/Alert.svelte';
	import { token } from '$lib/stores';
	import * as Sentry from '@sentry/svelte';
	export let orientationRequest: GetNotebookByBeneficiaryIdQuery['notebook'][0]['beneficiary']['orientationRequest'][0];
	export let onBeneficiaryOrientationChanged: () => void;

	let displayError = false;

	async function confirmOrientationRequestDenial() {
		try {
			await postApiJson(
				'/v1/deny-orientation-request',
				{
					orientation_request_id: orientationRequest.id,
				},
				{ 'jwt-token': $token }
			);
		} catch (err) {
			Sentry.captureException(err);
			displayError = true;
			return;
		}
		onBeneficiaryOrientationChanged();
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
	{#if displayError}
		<Alert type="error" size="sm">Impossible de valider le maintien de l'orientation.</Alert>
		<Button outline={true} on:click={cancelOrientationRequestDenial}>Fermer</Button>
	{:else}
		<div class="flex flex-row gap-6 mt-12">
			<Button on:click={confirmOrientationRequestDenial}>Oui</Button>
			<Button outline={true} on:click={cancelOrientationRequestDenial}>Annuler</Button>
		</div>
	{/if}
</section>
