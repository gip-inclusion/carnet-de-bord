<script lang="ts">
	import type { MenuItem } from '$lib/types';
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';

	const menuItems: MenuItem[] = [];
</script>

<Header {menuItems} />
<div class="fr-container fr-mb-8w">
	<slot />
</div>

<Footer />
