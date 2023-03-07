<script lang="ts">
	import type { MenuItem } from '$lib/types';
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';
	import NPSRating from '$lib/ui/NPSRating/NPSRating.svelte';

	const menuItems: MenuItem[] = [];
</script>

<Header {menuItems} />
<div class="fr-container fr-mb-8w">
	<slot />
	<NPSRating />
</div>

<Footer />
