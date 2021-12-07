<script context="module">
	let counter = 0;
</script>

<script lang="ts">
	import { getContext, onMount } from 'svelte';

	import { ACCORDION } from './accordion';

	export let title: string;

	let ref = null;
	let contentRef = null;
	let internalItemKey = {}; // used for identify accordion
	const accordionId = `accordion-${counter++}`;
	const { registerAccordionItem, selectedItem, toggleAccordion } = getContext(ACCORDION);
	registerAccordionItem(internalItemKey);
	$: expanded = $selectedItem === internalItemKey;
</script>

<li>
	<section data-dsfr-accordion class="fr-accordion">
		<h3 class="fr-accordion__title">
			<button class="fr-accordion__btn" aria-expanded={expanded} aria-controls={accordionId}
				>{title}</button
			>
		</h3>
		<div class="fr-collapse" id={accordionId}>
			<slot />
		</div>
	</section>
</li>
