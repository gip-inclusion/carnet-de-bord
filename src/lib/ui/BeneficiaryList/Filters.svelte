<script lang="ts" context="module">
	export type AllFilter = 'all';
	export type noMember = 'noMember';
	export type withMember = 'withMember';

	export type MemberFilter = AllFilter | noMember | withMember;

	export function getFilter(filter: string): MemberFilter {
		switch (filter) {
			case 'noMember':
			case 'withMember':
			case 'all':
				return filter;
			default:
				return 'all';
		}
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { Select } from '$lib/ui/base';

	export let filter: string;
	export let search: string;

	const dispatch = createEventDispatcher();

	let filterOptions: { label: string; name: MemberFilter }[] = [
		{ label: 'Tous', name: 'all' },
		{ label: 'Suivi', name: 'withMember' },
		{ label: 'Non suivi', name: 'noMember' },
	];

	function onSubmit() {
		dispatch('filter-update', { filter, search: search.trim() });
	}

	function updateFilters(event: CustomEvent<{ selected: MemberFilter }>) {
		dispatch('filter-update', { filter: event.detail.selected, search: search.trim() });
	}
</script>

<form on:submit|preventDefault={onSubmit}>
	<div class="flex items-end justify-between">
		<Select
			bind:selected={filter}
			on:select={updateFilters}
			options={filterOptions}
			selectLabel="Rattachement"
			classNames="!mb-0"
			name="filter"
		/>
		<div class="fr-search-bar" role="search">
			<label class="fr-label sr-only" for="search-beneficiary-input">
				Rechercher des beneficiaire
			</label>
			<input
				class="fr-input"
				placeholder="Nom de famille"
				type="search"
				id="search-beneficiary-input"
				name="search"
				bind:value={search}
			/>
			<button class="fr-btn"> Rechercher </button>
		</div>
	</div>
</form>
