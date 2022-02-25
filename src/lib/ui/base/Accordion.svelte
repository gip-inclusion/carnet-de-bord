<script lang="ts">
	import { getContext } from 'svelte';
	import { ACCORDION, accordionCounter } from './accordion';

	export let title: string;

	let internalItemKey = {}; // used for identify accordion
	const accordionId = `accordion-${$accordionCounter++}`;
	const { registerAccordionItem, selectedItem } = getContext(ACCORDION);
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
