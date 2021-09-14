<script context="module">
	let counter = 0;
</script>

<script type="ts">
	import { getContext, onMount } from 'svelte';

	import { ACCORDION } from './accordion';

	export let title: string;

	let ref = null;
	let contentRef = null;
	let internalItemKey = {}; // used for identify accordion
	const accordionId = `accordion-${counter++}`;
	const { registerAccordionItem, accordionItems, selectedItem, toggleAccordion } =
		getContext(ACCORDION);
	registerAccordionItem(internalItemKey);
	$: expanded = $selectedItem === internalItemKey;
	let collapseSize = 0;
	onMount(() => {
		if (contentRef && contentRef.firstChild) {
			collapseSize = contentRef.firstChild.offsetHeight;
		}
	});
</script>

{#if $accordionItems.length > 1}
	<li>
		<section data-dsfr-accordion class="fr-accordion">
			<h3 class="fr-accordion__title">
				<button
					bind:this={ref}
					class="fr-accordion__btn"
					on:click={() => {
						toggleAccordion(internalItemKey);
						if (expanded && ref && ref.getBoundingClientRect().top < 0) {
							contentRef;
							ref.scrollIntoView();
						}
					}}
					aria-expanded={expanded}
					aria-controls={accordionId}>{title}</button
				>
			</h3>
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
{:else}
	<section data-dsfr-accordion class="fr-accordion">
		<h3 class="fr-accordion__title">
			<button
				bind:this={ref}
				class="fr-accordion__btn"
				on:click={() => {
					toggleAccordion(internalItemKey);
					if (expanded && ref && ref.getBoundingClientRect().top < 0) {
						ref.scrollIntoView();
					}
				}}
				aria-expanded={expanded}
				aria-controls={accordionId}>{title}</button
			>
		</h3>
		<div class="fr-collapse pb-2" class:fr-collapse--expanded={expanded} id={accordionId}>
			<slot />
		</div>
	</section>
{/if}
