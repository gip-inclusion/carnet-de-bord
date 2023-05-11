<script lang="ts">
	export let title: string;
</script>

<section class="fr-accordion pb-8">
	<h2 class="fr-accordion__title">
		<div class="fr-accordion__btn !py-6 !pl-0 after:content-none">
			<span class="text-vert-cdb text-2xl font-bold">{title}</span>
		</div>
	</h2>
	<slot />
</section>
