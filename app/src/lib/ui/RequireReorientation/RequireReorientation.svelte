<script lang="ts">
	import * as yup from 'yup';
	import { Form, Select, Textarea } from '$lib/ui/forms';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { Alert, Button } from '../base';
	import { openComponent } from '$lib/stores';
	import { operationStore, query, mutation } from '@urql/svelte';
	import type { OperationStore } from '@urql/svelte';
	import {
		GetOrientationTypeDocument,
		type GetOrientationTypeQuery,
		ReorientationRequestDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';

	export let beneficiaryId: string;

	const initialValues = {};

	let orientationTypeStore: OperationStore<GetOrientationTypeQuery> = operationStore(
		GetOrientationTypeDocument
	);
	query(orientationTypeStore);

	$: orientationOptions =
		$orientationTypeStore.data?.orientation_type.map(({ id, label }) => ({
			name: id,
			label: label,
		})) ?? [];

	function close() {
		openComponent.close();
	}

	const reorientationStore = operationStore(ReorientationRequestDocument);
	const requireReorientation = mutation(reorientationStore);
	let errorMessage = null;
	async function handleSubmit(values) {
		errorMessage = null;
		const { error } = await requireReorientation({
			beneficiaryId: beneficiaryId,
			reason: values.reason,
			requestedOrientation: values.orientation,
		});
		if (error) {
			errorMessage = error.message;
		} else {
			openComponent.close();
		}
	}

	const validationSchema = yup.object().shape({
		reason: yup.string().nullable().trim().required(),
		orientation: yup.string().trim().required(),
	});
</script>

<section class="flex flex-col w-full">
	<div class="pb-8">
		<h1>Demande de réorientation</h1>
		<p class="mb-0">
			Veuillez saisir le motif de votre demande et sélectionner le type de dispositif que vous
			recommandez.
		</p>
	</div>
	<Form {initialValues} onSubmit={handleSubmit} {validationSchema} let:isValid let:form>
		<Textarea
			name="reason"
			placeholder="Je souhaite réorienter ..."
			label="Motif de demande de réorientation"
		/>
		<Select
			name="orientation"
			selectLabel={'Orientation recommandée'}
			selectHint={'Sélectionnez un dispositif'}
			options={orientationOptions}
			required
		/>

		<div class="flex flex-row gap-6 pt-4 pb-12">
			<Dialog
				title="Confirmation de l'envoi"
				label="Envoyer ma demande"
				outlineButton={false}
				on:confirm={() => handleSubmit(form)}
			>
				<p>Etes-vous sûr de vouloir envoyer la demande ?</p>
			</Dialog>
			<Button outline on:click={close}>Annuler</Button>
		</div>
		{#if errorMessage}
			<Alert type="error" size="sm" title="La demande de réorientation a échoué">
				<details>
					<summary>Voir le détail</summary>
					<pre>{JSON.stringify(errorMessage, null, 2)}</pre>
				</details>
			</Alert>
		{/if}
	</Form>
</section>
