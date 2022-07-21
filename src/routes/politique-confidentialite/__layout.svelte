<script lang="ts">
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';

	import { LayerCDB } from '$lib/ui/index';
</script>

<Header menuItems={[]} />

<div class="fr-container" style="min-height: calc(100vh - 200px)">
	<slot />
	<LayerCDB />
</div>

<Footer />
