<script context="module">
	let counter = 0;
</script>

<script lang="ts">
	counter++;
	const uniqueId = `search-bar-input-${counter}`;
	export let id: string | null = `search-bar-${counter}`;
	export let size: string | null = 'lg';
	export let btnLabel: string | null = '';
	export let inputLabel: string | null = 'Recherche';
	export let inputHint: string | null = 'Recherche';
	export let search: string | null;
	export let btnDisabled: boolean | null = false;
	export let handleSubmit: (event: Event) => void | undefined = undefined;
	export let twWidthClass = '';
	export let classNames = '';
</script>

<form class={`${twWidthClass} ${classNames}`} on:submit|preventDefault={handleSubmit}>
	<div class={`fr-search-bar ${size === 'md' ? '' : 'fr-search-bar--lg'}`} {id} role="search">
		{#if inputLabel}
			<label class="fr-label" for={uniqueId}>
				{inputLabel}
			</label>
		{/if}
		<input
			class="fr-input"
			placeholder={inputHint}
			type="search"
			id={uniqueId}
			name={uniqueId}
			bind:value={search}
			disabled={!handleSubmit}
		/>
		<button class="fr-btn" disabled={!handleSubmit || btnDisabled} title={btnLabel}>
			{btnLabel}
		</button>
	</div>
</form>

<style>
	/* Remove chrome clear icon */
	input[type='search']::-webkit-search-cancel-button {
		-webkit-appearance: none;
	}
</style>
