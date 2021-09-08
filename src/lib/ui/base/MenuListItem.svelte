<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';
	import { MENU } from './MenuButton.svelte';
	const { registerMenuItem, selectedItem, focusedItem } = getContext(MENU);

	export let disabled = false;
	export let href: string = null;

	let internalItemKey = {};

	let item: HTMLButtonElement | HTMLAnchorElement;
	export function focus() {
		item.focus();
	}
	const dispatch = createEventDispatcher();

	function selectItem() {
		dispatch('select');
	}
	selectedItem.subscribe(() => {
		if ($selectedItem === internalItemKey) {
			item.click();
		}
	});

	registerMenuItem(internalItemKey);
</script>

{#if href}
	<a
		class="bt px-4 py-3 hover:bg-gray-100 text-sm"
		class:bg-gray-100={$focusedItem === internalItemKey}
		bind:this={item}
		role="menuitem"
		aria-disabled={disabled}
		on:click={selectItem}
		{href}
		tabindex="-1"
	>
		<slot />
	</a>
{:else}
	<button
		tabindex="-1"
		class="hover:bg-gray-100 px-4 py-3 text-sm"
		class:bg-gray-100={$focusedItem === internalItemKey}
		bind:this={item}
		role="menuitem"
		aria-disabled={disabled}
		type="button"
		on:click={selectItem}
	>
		<slot />
	</button>
{/if}
