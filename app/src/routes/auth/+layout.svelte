<script lang="ts">
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';
</script>

<Header menuItems={[]} />

<div class="fr-container" style="min-height: calc(100vh - 142.5px)">
	<div class="flex flex-row">
		<slot />
	</div>
</div>

<Footer />
