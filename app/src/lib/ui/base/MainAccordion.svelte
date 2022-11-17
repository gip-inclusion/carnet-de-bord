<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	import { ACCORDION, accordionCounter } from './accordion';

	export let title: string;

	let internalItemKey = {}; // used for identify accordion
	const accordionId = `main-accordion-${$accordionCounter++}`;
	const { registerAccordionItem, selectedItem, isFixed } = getContext<{
		registerAccordionItem: (accordion: Record<never, never>) => void;
		accordionItems: Writable<Record<never, never>[]>;
		selectedItem: Writable<Record<never, never>>;
		isFixed: Writable<boolean>;
	}>(ACCORDION);
	registerAccordionItem(internalItemKey);
	$: expanded = $selectedItem === internalItemKey;
</script>

<li>
	<section data-dsfr-accordion class="fr-accordion pb-8">
		<h2 class="fr-accordion__title ">
			{#if isFixed}
				<div class="fr-accordion__btn !py-6 !pl-0 after:content-none" aria-controls={accordionId}>
					<span class="text-france-blue text-2xl font-bold">{title}</span>
				</div>
			{:else}
				<button
					class="fr-accordion__btn !py-6 !pl-0"
					aria-expanded={expanded}
					aria-controls={accordionId}
					><span class="text-france-blue text-2xl font-bold">{title}</span></button
				>
			{/if}
		</h2>
		<div class:fr-collapse={!isFixed} id={accordionId}>
			<slot />
		</div>
	</section>
</li>
