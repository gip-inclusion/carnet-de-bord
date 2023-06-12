<script lang="ts" context="module">
	import * as yup from 'yup';

	const validationSchema = yup.object().shape({
		denyOrientationReason: yup.string().nullable(),
	});
	export type DenyOrientationValidationSchema = yup.InferType<typeof validationSchema>;
</script>

<script lang="ts">
	import type { GetNotebookByBeneficiaryIdQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';
	import { postApiJson } from '$lib/utils/post';
	import Alert from '../base/Alert.svelte';
	import { captureException } from '$lib/utils/sentry';
	import { Form, Textarea } from '$lib/ui/forms';
	export let orientationRequest: GetNotebookByBeneficiaryIdQuery['notebook'][0]['beneficiary']['orientationRequest'][0];
	export let onBeneficiaryOrientationChanged: () => void;

	const initialValues = {};

	let displayError = false;

	async function confirmOrientationRequestDenial(values: DenyOrientationValidationSchema) {
		try {
			console.log(values);
			console.log({
				orientation_request_id: orientationRequest.id,
				orientation_reason: values['denyOrientationReason'],
			});

			await postApiJson('/v1/orientation_requests/deny', {
				orientation_request_id: orientationRequest.id,
				orientation_request_decision_reason: values['denyOrientationReason'],
			});
		} catch (err) {
			captureException(err);
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
		<p class="mb-0">Veuillez saisir le motif de maintien en accompagnement.</p>
	</div>
	<Form
		onSubmit={confirmOrientationRequestDenial}
		{initialValues}
		{validationSchema}
		let:isSubmitting
		let:isSubmitted
		let:isValid
	>
		<Textarea
			name="denyOrientationReason"
			placeholder="Saisir le motif de maintien en accompagnement"
			hint="Le motif de maintien en accompagnement sera disponible pour la personne désignée référente unique."
			label="Motif de maintien en accompagnement"
		/>

		{#if displayError}
			<Alert type="error" size="sm">Impossible de valider le maintien de l'orientation.</Alert>
			<Button outline={true} on:click={cancelOrientationRequestDenial}>Fermer</Button>
		{:else}
			<div class="flex flex-row gap-6 mt-12">
				<Button type="submit" disabled={(isSubmitted && !isValid) || isSubmitting}>Valider</Button>
				<Button outline on:click={cancelOrientationRequestDenial}>Annuler</Button>
			</div>
		{/if}
	</Form>
</section>
