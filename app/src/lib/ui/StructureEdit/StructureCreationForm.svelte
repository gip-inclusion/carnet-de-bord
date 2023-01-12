<script lang="ts">
	import { Button } from '$lib/ui/base';
	import { Form, Input } from '$lib/ui/forms';
	import type { GetStructuresForDeploymentQuery } from '$lib/graphql/_gen/typed-document-nodes';

	import { type StructureFormInput, structureSchema } from './structure.schema';

	export let submitLabel = 'Mettre à jour';
	export let initialValues: GetStructuresForDeploymentQuery['structure'][0];
	export let onSubmit: (values: StructureFormInput) => void;
	export let onCancel: () => void = null;
	function submitHandler(values: StructureFormInput) {
		onSubmit(structureSchema.cast(values));
	}
</script>

<Form
	{initialValues}
	validationSchema={structureSchema}
	onSubmit={submitHandler}
	let:isSubmitting
	let:isSubmitted
	let:isValid
>
	<div class="max-w-lg">
		<Input placeholder="Pole insertion" inputLabel="Nom" name="name" />
		<Input placeholder="service d'insertion" inputLabel="Description" name="shortDesc" />
		<Input placeholder="agence@cd08.fr" inputLabel="Courriel" name="email" />
		<Input
			placeholder=""
			inputLabel="Téléphones"
			name="phone"
			inputHint="Si plusieurs téléphones, utiliser une virgule pour les séparer"
		/>
		<Input placeholder="" inputLabel="Siret" name="siret" />
		<Input placeholder="" inputLabel="Adresse" name="address1" />
		<Input placeholder="10 rue des mésanges" inputLabel="Complément d'adresse" name="address2" />
		<div class="fr-grid-row fr-grid-row--gutters fr-grid-row--top">
			<Input
				class="fr-col-3 max-w-max"
				inputLabel="Code postal"
				placeholder="75008"
				name="postalCode"
			/>
			<Input class="fr-col-9" inputLabel="Ville" placeholder="Paris" name="city" />
		</div>
		<Input placeholder="https://monsite.url" inputLabel="Site web" name="website" />

		<div class="flex flex-row gap-6 mt-12">
			<Button type="submit" disabled={(isSubmitted && !isValid) || isSubmitting}
				>{submitLabel}</Button
			>
			{#if onCancel}<Button outline={true} on:click={onCancel}>Annuler</Button>{/if}
		</div>
	</div>
</Form>
