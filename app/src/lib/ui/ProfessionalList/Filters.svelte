<script lang="ts" context="module">
	export type BeneficiaryCountFilter = 'all' | 'noBeneficiaries' | 'withBeneficiaries';

	export function getFilter(filter: string): BeneficiaryCountFilter {
		switch (filter) {
			case 'noBeneficiaries':
			case 'withBeneficiaries':
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

	const dispatch = createEventDispatcher();

	const filterOptions: { label: string; name: BeneficiaryCountFilter }[] = [
		{ label: 'Tous', name: 'all' },
		{ label: 'Avec', name: 'withBeneficiaries' },
		{ label: 'Sans', name: 'noBeneficiaries' },
	];

	function onSubmit() {
		dispatch('filter-update', { filter });
	}

	function updateFilters(event: CustomEvent<{ selected: BeneficiaryCountFilter }>) {
		dispatch('filter-update', { filter: event.detail.selected });
	}
</script>

<form on:submit|preventDefault={onSubmit}>
	<div class="flex items-end justify-between">
		<Select
			bind:selected={filter}
			on:select={updateFilters}
			options={filterOptions}
			selectLabel="BRSA suivis"
			classNames="!mb-0"
			name="filter"
		/>
	</div>
</form>
