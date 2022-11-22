<script lang="ts">
	import type { GetNotebookByBeneficiaryIdQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { Button } from '$lib/ui/base';
	import { formatDateLocale } from '$lib/utils/date';
	import { openComponent } from '$lib/stores';
	import DenyOrientationRequestConfirmation from './DenyOrientationRequestConfirmation.svelte';
	import AcceptOrientationRequestForm from './AcceptOrientationRequestForm.svelte';

	export let orientationRequest: GetNotebookByBeneficiaryIdQuery['notebook'][0]['beneficiary']['orientationRequest'][0];

	function acceptOrientationRequest() {
		openComponent.open({ component: AcceptOrientationRequestForm, props: { orientationRequest } });
	}
	function denyOrientationRequest() {
		openComponent.open({
			component: DenyOrientationRequestConfirmation,
			props: { orientationRequest },
		});
	}
</script>

<div class="flex flex-row mb-8 items-center">
	<div class="text-france-blue fr-icon-info-fill" />
	<div class="fr-container">
		<div class="fr-text--bold text-france-blue">
			Demande de réorientation envoyée le {formatDateLocale(orientationRequest.createdAt)}
		</div>
		<div>
			Orientation recommandée : {orientationRequest.requestedOrientationType.label}
		</div>
	</div>
	<div class="flex flex-row flex-none items-center gap-6 h-8">
		<Button title="Réorienter" on:click={() => acceptOrientationRequest()}>Réorienter</Button>
		<Button title="Maintenir l'accompagnement" on:click={() => denyOrientationRequest()}>
			Maintenir l'accompagnement
		</Button>
	</div>
</div>
