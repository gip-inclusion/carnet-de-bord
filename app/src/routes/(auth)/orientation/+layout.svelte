<script lang="ts">
	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import { homeForRole } from '$lib/routes';
	import type { MenuItem } from '$lib/types';
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';

	const menuItems: MenuItem[] = [
		{
			id: 'accueil',
			path: homeForRole(RoleEnum.OrientationManager),
			label: 'Accueil',
		},
	];
</script>

<Header {menuItems} />

<div class="fr-container">
	<slot />
</div>

<Footer />
