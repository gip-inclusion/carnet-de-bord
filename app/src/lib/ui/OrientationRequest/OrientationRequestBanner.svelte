<script lang="ts">
	import type {
		GetNotebookQuery,
		GetNotebookByBeneficiaryIdQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { Button } from '$lib/ui/base';
	import { formatDateLocale } from '$lib/utils/date';
	import { openComponent } from '$lib/stores';
	import DenyOrientationRequestConfirmation from './DenyOrientationRequestConfirmation.svelte';
	import ChangeOrientationForm from './ChangeOrientationForm.svelte';
	import { createEventDispatcher } from 'svelte';

	export let orientationRequest: GetNotebookByBeneficiaryIdQuery['notebook'][0]['beneficiary']['orientationRequest'][0];
	export let notebook:
		| GetNotebookByBeneficiaryIdQuery['notebook'][0]
		| GetNotebookQuery['notebook'];

	const dispatch = createEventDispatcher();

	function onBeneficiaryOrientationChanged() {
		dispatch('beneficiary-orientation-changed');
	}

	function acceptOrientationRequest() {
		openComponent.open({
			component: ChangeOrientationForm,
			props: {
				notebook,
				orientationRequestId: orientationRequest.id,
				onBeneficiaryOrientationChanged,
			},
		});
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
