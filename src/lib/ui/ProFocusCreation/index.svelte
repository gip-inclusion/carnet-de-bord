<script lang="ts">
	import { session } from '$app/stores';
	import { mutation, operationStore } from '@urql/svelte';
	import {
		focusThemeKeys,
		contractTypeFullKeys,
		situationKeys,
		focusToSituations
	} from '$lib/constants/keys';

	import type { Option } from '$lib/types';
	import { Button, Checkboxes, Radio, Select } from '$lib/ui/base';
	import { openComponent } from '$lib/stores';
	import ProFocusCreationConfirmation from './ProFocusCreationConfirmation.svelte';
	import { AddNotebookFocusDocument } from '$lib/graphql/_gen/typed-document-nodes';

	function close() {
		openComponent.close();
	}

	export let notebook: { id: string };

	let selectedContract: Option | null = null;
	let contractOptions: Option[] = contractTypeFullKeys.keys
		.map((key: string) => ({
			name: key,
			label: contractTypeFullKeys.byKey[key]
		}))
		.concat([{ name: 'none', label: 'Aucun' }]);
	let selectedFocus: Option | null = null;
	let focusOptions: Option[] = focusThemeKeys.keys.map((key) => ({
		name: key,
		label: focusThemeKeys.byKey[key]
	}));

	let situations: string[] = [];
	let situationOptions: Option[];
	$: {
		situationOptions = Object.entries(situationKeys.byKey)
			.filter(([k]) => (focusToSituations[selectedFocus?.name] || []).includes(k))
			.map(([name, label]) => ({ name, label }));
	}

	let disabled = false;

	const addNotebookFocusStore = operationStore(AddNotebookFocusDocument);
	const addNotebookFocus = mutation(addNotebookFocusStore);
	async function createFocus() {
		const store = await addNotebookFocus({
			notebookId: notebook.id,
			theme: selectedFocus.name,
			situations
		});
		if (store.error) {
			console.log('createFocus error', {
				error: store.error,
				creatorId: $session.user.professionalId
			});
		} else {
			openComponent.open({ component: ProFocusCreationConfirmation });
		}
	}
</script>

<div class="flex flex-col gap-6 mb-6">
	<div>
		<h1>Ajouter un axe de travail</h1>
		<p class="mb-0">
			Veuillez renseigner les informations ci-dessous pour créer un nouvel axe de travail.
		</p>
	</div>
	<div>
		<h2 class="fr-h4 bf-500">Axe de travail</h2>
		<Radio
			caption={"Veuillez sélectionner le type de contrat intégrant l'axe de travail."}
			bind:selected={selectedContract}
			options={contractOptions}
		/>
		<Select selectLabel={'Thème'} options={focusOptions} bind:selected={selectedFocus} />
	</div>
	{#if selectedFocus}
		<div>
			<h2 class="fr-h4 bf-500">Situation</h2>
			<Checkboxes
				globalClassNames={'flex flex-row flex-wrap gap-4'}
				checkboxesCommonClassesNames={`!mt-0 w-5/12`}
				caption={''}
				bind:selectedOptions={situations}
				options={situationOptions}
			/>
		</div>
	{/if}
	<div class="h-full flex-stretch">{' '}</div>
	<div>
		<Button {disabled} on:click={createFocus}>Valider</Button>
		<Button outline={true} on:click={close}>Annuler</Button>
	</div>
</div>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}
</style>
