<script lang="ts">
	import { homeForRole } from '$lib/routes';
	import type { MenuItem } from '$lib/types';
	import { accountData } from '$lib/stores';
	import { NPSRating } from '$lib/ui/NPSRating';
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';
	const menuItems: MenuItem[] = [
		{
			id: 'accueil',
			path: homeForRole($accountData.type),
			label: 'Accueil',
		},
	];
</script>

<Header {menuItems} />

<div class="fr-container fr-py-6w fr-px-1w">
	<div class="flex flex-col gap-8">
		<slot />
	</div>
	<NPSRating />
</div>

<Footer />
