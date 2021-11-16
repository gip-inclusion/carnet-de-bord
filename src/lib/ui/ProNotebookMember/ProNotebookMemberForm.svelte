<script lang="ts">
	import type { AccountRequest, Structure } from '$lib/types';

	import ProCreationForm from '$lib/ui/ProCreationForm/index.svelte';

	export let name: string;
	export let disabled: boolean;
	export let accountRequest: AccountRequest = {};
	export let errors: AccountRequest = {};
	export let onCancel: () => void;
	export let onInput: () => void;
	export let onSubmit: (s: Structure) => void;
</script>

<section class="flex flex-col gap-6">
	<div>
		<h1 class="mb-0">Ajouter un nouvel accompagnateur</h1>
		<p class="mb-0">
			Recherchez un accompagnateur et envoyez une invitation à rejoindre le groupe de suivi de {name}.
		</p>
	</div>
	<ProCreationForm
		submitLabel="Envoyer l'invitation"
		{disabled}
		{accountRequest}
		{errors}
		{onCancel}
		{onInput}
		{onSubmit}
	/>
</section>
