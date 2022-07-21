<script lang="ts">
	import type { MenuItem } from '$lib/types';
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';

	import { LayerCDB } from '$lib/ui/index';

	const menuItems: MenuItem[] = [
		{
			id: 'accueil',
			path: '/admin',
			label: 'Accueil',
		},
	];
</script>

<Header {menuItems} />
<div class="fr-container fr-mb-8w">
	<slot />
	<LayerCDB />
</div>

<Footer />
