<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { Button } from '$lib/ui/base';
	import type { OrientedFilter } from './OrientationFilter';
	import { Form, Select, Input } from '$lib/ui/forms';
	import { supportFilterSchema, SupportFilterValues } from './supportFilter.schema';

	export let filter: string;
	export let search: string;
	export let member: string;

	$: initialValues = { filter, search };

	const dispatch = createEventDispatcher();

	const orientationStatusfilterOptions: { label: string; name: OrientedFilter }[] = [
		{ label: 'Tous', name: 'tous' },
		{ label: 'Accompagné', name: 'referent' },
		{ label: "En attente d'un référent", name: 'sans-referent' },
		{ label: 'Non accompagné', name: 'sans-structure' },
	];

	function onSubmit(values: SupportFilterValues) {
		dispatch('filter-update', { filter: 'tous', search: values.search.trim() });
	}

	function updateFilters(event: CustomEvent<{ selected: OrientedFilter }>) {
		dispatch('filter-update', { filter: event.detail.selected, search: '' });
	}
	function removeMemberFilter() {
		dispatch('filter-update', { resetMember: true, filter, search });
	}
</script>

<Form {initialValues} {onSubmit} validationSchema={supportFilterSchema}>
	<div class="flex items-end justify-between">
		<Select
			selectLabel="Rattachement"
			name="filter"
			options={orientationStatusfilterOptions}
			on:select={updateFilters}
		/>

		<div class="fr-search-bar" role="search">
			<Input name="search" inputLabel="Rechercher des beneficiaire" placeholder="Nom de famille" />
			<button class="fr-btn"> Rechercher </button>
		</div>
	</div>
	{#if member}
		<p class="flex items-center gap-4 font-medium fr-mt-2w">
			<span>
				{member}
			</span>
			<Button
				icon="fr-icon-close-line"
				on:click={removeMemberFilter}
				classNames="fr-btn fr-btn--tertiary-no-outline fr-btn--sm">Supprimer le filtre</Button
			>
		</p>
	{/if}
</Form>
