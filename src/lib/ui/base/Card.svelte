<script lang="ts">
	import Link from '$lib/ui/base/Link.svelte';

	export let horizontal = false;
	export let imageUrl = '';
	export let href = '';
	export let detail = '';
	export let largeLink = true;
	export let hideArrow = false;
	export let disabledHover = false;
	export let onClick: ((event: Event) => void) | null = null;

	if (!href && !onClick) {
		disabledHover = true;
	}
</script>

<div
	on:click={onClick}
	class={`
fr-card
${horizontal ? 'fr-card--horizontal' : ''}
${largeLink ? 'fr-enlarge-link' : ''}
${hideArrow ? 'fr-card--no-arrow' : ''}
${disabledHover ? 'force-disable-hover' : 'cursor-pointer'}
`}
>
	<div class="fr-card__body">
		<h4 class="fr-card__title">
			{#if href}
				<Link {href} classNames="fr-card__link">
					<slot name="title" />
				</Link>
			{:else}
				<slot name="title" />
			{/if}
		</h4>
		{#if $$slots.description}
			<p class="leading-6 text-sm my-0">
				<slot name="description" />
			</p>
		{/if}
		{#if detail}
			<p class="fr-card__detail">
				{detail}
			</p>
		{/if}
	</div>
	{#if imageUrl}
		<div class="fr-card__img">
			<img src={imageUrl} class="fr-responsive-img" alt="" aria-hidden="true" />
			<!-- L'alternative de l'image (attribut alt) doit à priori rester vide car l'image est illustrative et ne doit pas être restituée aux technologies d’assistance. Vous pouvez toutefois remplir l'alternative si vous estimer qu'elle apporte une information essentielle à la compréhension du contenu non présente dans le texte -->
		</div>
	{/if}
</div>

<style lang="postcss">
	.force-disable-hover {
		background-image: none !important;
	}
</style>
