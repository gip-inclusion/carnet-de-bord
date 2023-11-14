<script lang="ts">
	import { Button } from '$lib/ui/base';
	import { Checkbox, Form } from '$lib/ui/forms';

	import { mutation, operationStore } from '@urql/svelte';
	import { UpdateAccountCguDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { accountData } from '$lib/stores';
	import { goto } from '$app/navigation';

	import * as yup from 'yup';

	$: errorMessage = '';
	export const cguSchema = yup.object().shape({
		cguValidated: yup
			.bool()
			.oneOf([true], 'Vous devez accepter les CGU avant de pouvoir continuer'),
	});

	const updateAccountCguStore = operationStore(UpdateAccountCguDocument, null, {
		additionalTypenames: ['professional_project', 'notebook', 'notebook_situation'],
	});
	const updateAccountCgu = mutation(updateAccountCguStore);

	const initialValues = {
		cguValidated: false,
	};

	async function handleSubmit() {
		const payload = {
			id: $accountData.id,
			cguValidatedAt: new Date().toISOString(),
		};

		errorMessage = null;
		await updateAccountCgu(payload);
		goto('/');
	}
</script>

<svelte:head>
	<title>CGU - Carnet de bord</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<h1 class="fr-h4 mt-8">Validation des CGU</h1>

	<div>BLABLABLABLABLAB</div>
	<div class="pt-8">
		<Form
			{initialValues}
			validationSchema={cguSchema}
			onSubmit={handleSubmit}
			let:isSubmitted
			let:isSubmitting
			let:isValid
		>
			<div class="pb-8">
				<Checkbox
					name="cguValidated"
					label="En cochant cette case, je déclare avoir pris connaissance des conditions générales d'utilisation du site internet et les accepter"
				/>
			</div>
			<Button type="submit" disabled={isSubmitting || (isSubmitted && !isValid)}>Valider</Button>
		</Form>
	</div>
</div>
