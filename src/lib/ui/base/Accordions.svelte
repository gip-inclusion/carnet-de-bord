<script lang="ts">
	import { onDestroy, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { ACCORDION } from './accordion';

	let accordionItems = writable([]);
	let selectedItem = writable(null);
	setContext(ACCORDION, {
		registerAccordionItem: (accordion) => {
			accordionItems.set($accordionItems.concat(accordion));
			onDestroy(() => {
				if ($selectedItem === accordionItems) {
					$selectedItem = null;
				}
				accordionItems.set($accordionItems.filter((item) => item !== accordion));
			});
		},
		accordionItems,
		selectedItem,
	});
</script>

{#if $accordionItems.length > 0}
	<ul class="fr-accordions-group">
		<slot />
	</ul>
{:else}
	<slot />
{/if}
