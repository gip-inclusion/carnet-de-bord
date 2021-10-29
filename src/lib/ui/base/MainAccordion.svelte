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
	let collapseSize = 0;
	onMount(() => {
		if (contentRef && contentRef.firstChild) {
			collapseSize = contentRef.firstChild.offsetHeight;
		}
	});
</script>

<li>
	<section data-dsfr-accordion class="fr-accordion">
		<h2 class="fr-accordion__title ">
			<button
				bind:this={ref}
				class="fr-accordion__btn !py-6 !pl-0"
				on:click={() => {
					toggleAccordion(internalItemKey);
					if (expanded && ref && ref.getBoundingClientRect().top < 0) {
						contentRef;
						ref.scrollIntoView();
					}
				}}
				aria-expanded={expanded}
				aria-controls={accordionId}
				><span class="text-france-blue text-2xl font-bold">{title}</span></button
			>
		</h2>
		<div
			class="fr-collapse"
			style={expanded
				? `max-height:none; --collapse: -${collapseSize}px}`
				: `--collapse: -${collapseSize}px`}
			class:fr-collapse--expanded={expanded}
			id={accordionId}
			bind:this={contentRef}
		>
			<slot />
		</div>
	</section>
</li>
