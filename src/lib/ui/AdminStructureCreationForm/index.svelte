<script context="module" lang="ts">
	import type { AccountRequest } from '$lib/types';

	import Button from '$lib/ui/base/Button.svelte';
	import { Form, Input } from '$lib/ui/forms';
	import { adminStructureAccountSchema, AdminStructureAccountInput } from './adminStructure.schema';
</script>

<script lang="ts">
	export let submitLabel = 'Je valide mon inscription';
	export let accountRequest: Partial<AccountRequest> & { phoneNumbers?: string } = {};
	export let onSubmit: (values: AdminStructureAccountInput) => void;
	export let onCancel: () => void = null;
</script>

<Form
	initialValues={{ ...accountRequest }}
	validationSchema={adminStructureAccountSchema}
	{onSubmit}
	let:isSubmitting
	let:isSubmitted
	let:isValid
>
	<div class="max-w-sm">
		<h2 class="text-france-blue fr-h4">Informations personnelles</h2>

		<Input placeholder="Jean Baptiste" inputLabel="Prénom" name="firstname" required />
		<Input placeholder="Poquelin" inputLabel="Nom" name="lastname" required />
		<Input placeholder="b@poquelin.fr" inputLabel="Courriel" name="email" required />
		<Input
			placeholder="0123456789, 0789542136"
			inputLabel="Numéros de téléphone"
			name="phoneNumbers"
			required
		/>

		<div class="flex flex-row gap-6 mt-12">
			<Button type="submit" disabled={(isSubmitted && !isValid) || isSubmitting}
				>{submitLabel}</Button
			>
			{#if onCancel}<Button outline={true} on:click={onCancel}>Annuler</Button>{/if}
		</div>
	</div>
</Form>
