<script lang="ts">
	import { onDestroy, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { ACCORDION, type AccordionContext } from './accordion';

	let accordionItems: Writable<Record<never, never>[]> = writable([]);
	let selectedItem: Writable<Record<never, never>> = writable(null);

	setContext<AccordionContext>(ACCORDION, {
		registerAccordionItem: (accordion: Record<never, never>): void => {
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
