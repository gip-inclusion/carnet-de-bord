<script lang="ts">
	import { Link } from '$lib/ui/base';

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
	on:keydown={onClick}
	class={`fr-card ${$$props.class}`}
	class:fr-card--horizontal={horizontal}
	class:fr-enlarge-link={largeLink}
	class:fr-card--no-arrow={hideArrow}
	class:force-disable-hover={disabledHover}
>
	<div class="fr-card__body">
		<div class="fr-card__content">
			{#if href || $$slots.title}
				<h4 class="fr-card__title">
					{#if href}
						<Link {href} classNames="fr-card__link">
							<slot name="title" />
						</Link>
					{:else}
						<slot name="title" />
					{/if}
				</h4>
			{/if}

			{#if $$slots.description}
				<div class="fr-card__desc">
					<slot name="description" />
				</div>
			{/if}
			{#if detail}
				<p class="fr-card__detail">
					{detail}
				</p>
			{/if}
			{#if $$slots.actions}
				<div class="fr-card__end">
					<slot name="actions" />
				</div>
			{/if}
		</div>
	</div>
	{#if imageUrl}
		<div class="fr-card__header">
			<div class="fr-card__img">
				<img src={imageUrl} class="fr-responsive-img" alt="" aria-hidden="true" />
				<!-- L'alternative de l'image (attribut alt) doit à priori rester vide car l'image est illustrative et ne doit pas être restituée aux technologies d’assistance. Vous pouvez toutefois remplir l'alternative si vous estimer qu'elle apporte une information essentielle à la compréhension du contenu non présente dans le texte -->
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.force-disable-hover {
		background-color: var(--background-contrast-grey) !important;
	}
	.fr-card--no-arrow::before,
	.fr-card--no-arrow::after {
		background-color: transparent;
	}
</style>
