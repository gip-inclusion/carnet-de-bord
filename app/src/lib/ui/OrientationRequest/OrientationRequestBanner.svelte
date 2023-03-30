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
		| GetNotebookQuery['notebook_public_view'][0]['notebook'];

	const dispatch = createEventDispatcher();

	function onBeneficiaryOrientationChanged() {
		dispatch('beneficiary-orientation-changed');
	}

	function acceptOrientationRequest() {
		openComponent.open({
			component: ChangeOrientationForm,
			props: {
				notebooks: [notebook],
				orientationRequestId: orientationRequest.id,
				onBeneficiaryOrientationChanged,
			},
		});
	}

	function denyOrientationRequest() {
		openComponent.open({
			component: DenyOrientationRequestConfirmation,
			props: { orientationRequest, onBeneficiaryOrientationChanged },
		});
	}
</script>

<div class="bg-gray-100">
	<div class="fr-container">
		<div class="flex flex-row gap-4 fr-py-3w items-top">
			<div class="text-france-blue fr-icon-info-fill" aria-hidden />
			<div class="">
				<p class="fr-text--bold text-france-blue mb-0">
					Demande de réorientation envoyée le {formatDateLocale(orientationRequest.createdAt)}
				</p>
				<p class="mb-0">
					Orientation recommandée : {orientationRequest.requestedOrientationSystem.name}
				</p>
			</div>
			<div class="flex flex-row ml-auto items-center gap-6">
				<Button title="Réorienter" on:click={() => acceptOrientationRequest()}>Réorienter</Button>
				<Button title="Maintenir l'accompagnement" on:click={() => denyOrientationRequest()}>
					Maintenir l'accompagnement
				</Button>
			</div>
		</div>
	</div>
</div>
