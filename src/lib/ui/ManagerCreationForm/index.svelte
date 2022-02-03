<script context="module" lang="ts">
	import type { AccountRequest } from '$lib/types';

	import Button from '$lib/ui/base/Button.svelte';
	import { Form, Input } from '$lib/ui/forms';
	import { managerAccountSchema, ManagerAccountInput } from './manager.schema';
</script>

<script lang="ts">
	export let submitLabel = 'Je valide mon inscription';
	export let accountRequest: Partial<AccountRequest> = {};
	export let onSubmit: (values: ManagerAccountInput) => void;
	export let onCancel: () => void;
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
		<h2 class="text-france-blue fr-h4">Informations personnelles</h2>

		<Input placeholder="Jean Baptiste" inputLabel="Prénom" name="firstname" required />
		<Input placeholder="Poquelin" inputLabel="Nom" name="lastname" required />
		<Input placeholder="b@poquelin.fr" inputLabel="Courriel" name="email" required />

		<div class="flex flex-row gap-6 mt-12">
			<Button type="submit" disabled={(isSubmitted && !isValid) || isSubmitting}
				>{submitLabel}</Button
			>
			<Button outline={true} on:click={onCancel}>Annuler</Button>
		</div>
	</div>
</Form>
