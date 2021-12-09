<script context="module">
	let counter = 0;
</script>

<script lang="ts">
	import { getContext, onMount } from 'svelte';

	import { ACCORDION } from './accordion';

	export let title: string;
 
	let internalItemKey = {}; // used for identify accordion
	const accordionId = `accordion-${counter++}`;
	const { registerAccordionItem, selectedItem, toggleAccordion } = getContext(ACCORDION);
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
		<div class="fr-collapse" id={accordionId} bind:this={contentRef}>
			<slot />
		</div>
	</section>
</li>
