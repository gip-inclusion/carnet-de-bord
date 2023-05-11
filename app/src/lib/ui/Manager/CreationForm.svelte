<script context="module" lang="ts">
	import type { AccountRequest } from '$lib/types';

	import { Button } from '$lib/ui/base';
	import { Form, Input } from '$lib/ui/forms';
	import { type ManagerAccountInput, managerAccountSchema } from './manager.schema';
</script>

<script lang="ts">
	export let submitLabel = 'Je valide mon inscription';
	export let accountRequest: Partial<AccountRequest> = {};
	export let onSubmit: (values: ManagerAccountInput) => void;
	export let onCancel: () => void = null;
	export let hiddenFields: Partial<Record<keyof AccountRequest, boolean>> = {};
</script>

<Form
	initialValues={{ ...accountRequest }}
	validationSchema={managerAccountSchema}
	{onSubmit}
	let:isSubmitting
	let:isSubmitted
	let:isValid
>
	<div>
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

		<div class="flex flex-row gap-6 mt-12">
			<Button type="submit" disabled={(isSubmitted && !isValid) || isSubmitting}
				>{submitLabel}</Button
			>
			{#if onCancel}<Button outline={true} on:click={onCancel}>Annuler</Button>{/if}
		</div>
	</div>
</Form>
