<script context="module" lang="ts">
	import type { AccountRequest } from '$lib/types';

	import { Button } from '$lib/ui/base';
	import { Form, Input } from '$lib/ui/forms';

	import {
		type AdminStructureAccountInput,
		adminStructureAccountSchema,
	} from './adminStructure.schema';
</script>

<script lang="ts">
	import { formatNames } from '../format';

	export let submitLabel = 'Je valide mon inscription';
	export let initialValues: Partial<AccountRequest> & { phoneNumbers?: string } = {};
	export let onSubmit: (values: AdminStructureAccountInput) => void;
	export let onCancel: () => void = null;
	export let hiddenFields: Partial<
		Record<keyof (AccountRequest & { phoneNumbers?: string }), boolean>
	> = {};

	function submitHandler(values: AdminStructureAccountInput) {
		onSubmit(adminStructureAccountSchema.cast(values));
	}
</script>

<Form
	initialValues={{
		...formatNames(initialValues),
		email: initialValues.email,
		phoneNumbers: initialValues.phoneNumbers,
	}}
	validationSchema={adminStructureAccountSchema}
	onSubmit={submitHandler}
	let:isSubmitting
	let:isSubmitted
	let:isValid
>
	<div class="max-w-sm">
		<h2 class="text-vert-cdb fr-h4">Informations personnelles</h2>

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
			placeholder="0123456789, 0789542136"
			inputLabel="Numéros de téléphone"
			name="phoneNumbers"
			class={hiddenFields.phoneNumbers ? 'hidden' : ''}
		/>

		<div class="flex flex-row gap-6 mt-12">
			<Button type="submit" disabled={(isSubmitted && !isValid) || isSubmitting}
				>{submitLabel}</Button
			>
			{#if onCancel}<Button outline={true} on:click={onCancel}>Annuler</Button>{/if}
		</div>
	</div>
</Form>
