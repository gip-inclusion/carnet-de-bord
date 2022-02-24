<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	import { ACCORDION, accordionCounter } from './accordion';

	export let title: string;

	let internalItemKey = {}; // used for identify accordion
	const accordionId = `main-accordion-${$accordionCounter++}`;
	const { registerAccordionItem, selectedItem } = getContext<{
		registerAccordionItem: (accordion: Record<never, never>) => void;
		accordionItems: Writable<Record<never, never>[]>;
		selectedItem: Writable<Record<never, never>>;
	}>(ACCORDION);
	registerAccordionItem(internalItemKey);
	$: expanded = $selectedItem === internalItemKey;
</script>

<li>
	<section data-dsfr-accordion class="fr-accordion">
		<h2 class="fr-accordion__title ">
			<button
				class="fr-accordion__btn !py-6 !pl-0"
				aria-expanded={expanded}
				aria-controls={accordionId}
				><span class="text-france-blue text-2xl font-bold">{title}</span></button
			>
		</h2>
		<div class="fr-collapse" id={accordionId}>
			<slot />
		</div>
	</section>
</li>
