<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import { ACCORDION, type AccordionContext, accordionCounter } from './accordion';

	export let title: string;
	let ref = null;
	const internalItemKey = {}; // used for identify accordion
	const accordionId = `accordion-${$accordionCounter++}`;
	const { registerAccordionItem, selectedItem } = getContext<AccordionContext>(ACCORDION);
	registerAccordionItem(internalItemKey);
	$: expanded = $selectedItem === internalItemKey;

	let overflow = false;
	let timeout: ReturnType<typeof setTimeout>;

	function disclose() {
		// this is a fix to allow a component with a floating part to not be cropped by the parent accordeon
		timeout = setTimeout(() => {
			overflow = true;
		}, 400);
	}
	function conceal() {
		overflow = false;
	}

	onMount(() => {
		if (ref) {
			ref.addEventListener('dsfr.disclose', disclose);
			ref.addEventListener('dsfr.conceal', conceal);
		}
	});
	onDestroy(() => {
		if (timeout) clearTimeout(timeout);
		if (ref) {
			ref.removeEventListener('dsfr.disclose', disclose);
			ref.removeEventListener('dsfr.conceal', conceal);
		}
	});
</script>

<li>
	<section data-dsfr-accordion class="fr-accordion">
		<h3 class="fr-accordion__title">
			<button class="fr-accordion__btn" aria-expanded={expanded} aria-controls={accordionId}
				>{@html title}</button
			>
		</h3>
		<div class="fr-collapse" id={accordionId} bind:this={ref} class:overflow-visible={overflow}>
			<slot />
		</div>
	</section>
</li>
