<script lang="ts">
	import * as yup from 'yup';
	import { Form, Select, Input } from '$lib/ui/forms';
	import { Button } from '../base';
	import { openComponent } from '$lib/stores';
	import { operationStore, query, mutation } from '@urql/svelte';
	import type { OperationStore } from '@urql/svelte';
	import {
		GetOrientationTypeDocument,
		type GetOrientationTypeQuery,
		ReorientationRequestDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { accountData } from '$lib/stores';

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

	async function handleSubmit(values) {
		console.log(values);
		await requireReorientation({
			beneficiaryId: beneficiaryId,
			reason: values.reason,
			requestedOrientation: values.orientation,
			requesterAccount: $accountData.id,
		});
	}

	const validationSchema = yup.object().shape({
		reason: yup.string().nullable(),
		orientation: yup.string(),
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
	<Form {initialValues} onSubmit={handleSubmit} {validationSchema}>
		<Input name="reason" inputLabel="Motif de demande de réorientation" type="text" />
		<Select
			name="orientation"
			selectLabel={'Orientation recommandée'}
			selectHint={'Sélectionnez un dispositif'}
			options={orientationOptions}
		/>

		<div class="flex flex-row gap-6 pt-4 pb-12">
			<Button type="submit">Envoyer ma demande</Button>
			<Button outline on:click={close}>Annuler</Button>
		</div>
	</Form>
</section>
