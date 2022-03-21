<script lang="ts" context="module">
	export type AllFilter = 'all';
	export type Nomember = 'nomember';
	export type Withmember = 'withmember';

	export type MemberFilter = AllFilter | Nomember | Withmember;

	export function getFilter(filter: string): MemberFilter {
		return filter === 'nomember' || filter === 'withmember' ? filter : 'all';
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Select from '../base/Select.svelte';

	export let filter;
	export let search;

	const dispatch = createEventDispatcher();

	let filterOptions: { label: string; name: MemberFilter }[] = [
		{ label: 'Tous', name: 'all' },
		{ label: 'Suivi', name: 'withmember' },
		{ label: 'Non suivi', name: 'nomember' },
	];

	function onSubmit() {
		dispatch('filter-update', { filter, search: search.trim() });
	}

	function updateFilters(event: CustomEvent<{ selected: MemberFilter }>) {
		dispatch('filter-update', { filter: event.detail.selected, search: search.trim() });
	}
</script>

<form {onSubmit}>
	<div class="flex items-end justify-between">
		<Select
			selected={filter}
			on:select={updateFilters}
			options={filterOptions}
			selectLabel="Rattachement"
			classNames="!mb-0"
			name="filter"
		/>
		<div class="fr-search-bar" role="search">
			<label class="fr-label sr-only" for="search-beneficiary-input">
				rechercher des beneficiaire
			</label>
			<input
				class="fr-input"
				placeholder="Nom de famille"
				type="search"
				id="search-beneficiary-input"
				name="search"
				value={search}
			/>
			<button class="fr-btn"> Rechercher </button>
		</div>
	</div>
</form>
