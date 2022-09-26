<script lang="ts">
	export let title = '';
	export let link = '';
	export let description = '';
	export let imageUrl = '';
</script>

<div class="fr-tile fr-enlarge-link">
	<div class="fr-tile__body">
		<h4 class="fr-tile__title">
			{#if title && link}
				<a class="fr-tile__link" href={link}>{title}</a>
			{:else if title}
				{title}
			{/if}
		</h4>
		{#if description}
			<p class="fr-tile__desc">{description}</p>
		{/if}
		<slot />
	</div>
	{#if imageUrl}
		<div class="fr-tile__img">
			<img src={imageUrl} class="fr-responsive-img" alt="" aria-hidden />
		</div>
	{/if}
</div>
