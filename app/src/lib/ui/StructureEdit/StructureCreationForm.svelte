<script lang="ts">
	import { Button, Checkboxes } from '$lib/ui/base';
	import { Form, Input, Checkbox } from '$lib/ui/forms';
	import type { GetStructureByIdQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import type { LabelName } from '$lib/types';

	import { type StructureFormInput, structureSchema } from './structure.schema';

	export let submitLabel = 'Enregistrer les modifications';
	export let initialValues: GetStructureByIdQuery['structure_by_pk'];
	export let orientationSystemOptions: LabelName[];
	export let onSubmit: (values: StructureFormInput, orientationSystems: string[]) => void;
	export let onCancel: () => void = null;

	function submitHandler(values: StructureFormInput) {
		onSubmit(structureSchema.cast(values), orientationSystems);
	}

	let orientationSystems: string[] = initialValues.orientationSystems.map(
		({ orientationSystem }) => {
			return orientationSystem.id;
		}
	);
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
		<h2 class="text-vert-cdb fr-h4">Informations générales</h2>

		<Input placeholder="Pole insertion" inputLabel="Nom" name="name" />

		<div class="mb-4">
			<Checkbox
				additionalLabel="Une structure sensible est une structure dont l'objet ou la dénomination fait référence, ou permet de déduire, des informations personnelles sensibles concernant un usager (suivi judiciaire, médical, opinion politique, religieuse, …)"
				name="sensitive"
				label="Structure sensible"
			/>
		</div>

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

		<h2 class="text-vert-cdb fr-h4">Dispositifs d'accompagnement</h2>
		{#if orientationSystemOptions.length === 0}
			<p>Aucun dispositif d'accompagnement affecté à cette structure.</p>
		{:else}
			<Checkboxes
				globalClassNames={'flex flex-row flex-wrap gap-4'}
				checkboxesCommonClassesNames={'!mt-0 w-5/12'}
				caption={"Dispositifs d'accompagnement"}
				bind:selectedOptions={orientationSystems}
				options={orientationSystemOptions}
				name="orientationSystems"
			/>
		{/if}

		<div class="flex flex-row gap-6 mt-12">
			<Button type="submit" disabled={(isSubmitted && !isValid) || isSubmitting}
				>{submitLabel}</Button
			>
			{#if onCancel}<Button outline={true} on:click={onCancel}>Annuler</Button>{/if}
		</div>
	</div>
</Form>
