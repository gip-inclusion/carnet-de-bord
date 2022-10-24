<script context="module" lang="ts">
	import { contactEmail } from '$lib/constants';
	import { GetStructuresDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { GetStructuresQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import type { AccountRequest } from '$lib/types';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { operationStore, type OperationStore, query } from '@urql/svelte';

	import { Button } from '$lib/ui/base';
	import { Form, Input, SvelecteSFL } from '$lib/ui/forms';
	import { type ProAccountWithStructureInput, proAccountSchemaWithStructure } from './pro.schema';
</script>

<script lang="ts">
	export let submitLabel = 'Je valide mon inscription';
	export let accountRequest: Partial<AccountRequest> = {};
	export let onSubmit: (values: ProAccountWithStructureInput) => void;
	export let onCancel: () => void = null;
	export let hiddenFields: Partial<Record<keyof AccountRequest, boolean>> = {};

	let result: OperationStore<GetStructuresQuery> = operationStore(GetStructuresDocument, {});
	query(result);

	$: options = $result?.data?.structure;
</script>

<Form
	initialValues={{ ...accountRequest }}
	validationSchema={proAccountSchemaWithStructure}
	{onSubmit}
	let:isSubmitting
	let:isSubmitted
	let:isValid
	let:form
>
	{#if !form.structureId}
		<LoaderIndicator {result}>
			<h2 class="text-france-blue fr-h4">Structure</h2>
			<div class="flex flex-row w-full gap-2">
				<div class="w-full">
					<SvelecteSFL
						name="structureId"
						inputLabel="Sélectionnez votre structure"
						inputHint={`Si vous ne trouvez pas votre structure, veuillez <a href="mailto:${contactEmail}">nous contacter</a>`}
						inputId="structure"
						{options}
						placeholder="Pôle emploi"
						valueField="id"
						labelField="name"
					/>
				</div>
			</div>
			<!-- end @TODO -->
		</LoaderIndicator>
	{:else}
		<div>
			<h2 class="text-france-blue fr-h4">Informations personnelles</h2>

			<Input
				placeholder="Jean Baptiste"
				inputLabel="Prénom"
				name="firstname"
				required
				class={hiddenFields.firstname ? 'hidden' : ''}
			/>
			<Input
				placeholder="Poquelin"
				inputLabel="Nom"
				name="lastname"
				required
				class={hiddenFields.lastname ? 'hidden' : ''}
			/>
			<Input
				placeholder="b@poquelin.fr"
				inputLabel="Courriel"
				name="email"
				required
				class={hiddenFields.email ? 'hidden' : ''}
			/>
			<Input
				placeholder="0123456789"
				inputLabel="Téléphone"
				name="mobileNumber"
				class={hiddenFields.mobileNumber ? 'hidden' : ''}
			/>
			<Input
				placeholder="Conseiller en insertion"
				inputLabel="Fonction"
				name="position"
				class={hiddenFields.position ? 'hidden' : ''}
			/>

			<div class="flex flex-row gap-6 mt-12">
				<Button type="submit" disabled={(isSubmitted && !isValid) || isSubmitting}
					>{submitLabel}</Button
				>
				{#if onCancel}<Button outline={true} on:click={onCancel}>Annuler</Button>{/if}
			</div>
		</div>
	{/if}
</Form>
