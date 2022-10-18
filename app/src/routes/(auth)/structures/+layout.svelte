<script lang="ts">
	import type { MenuItem } from '$lib/types';
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';

	import { homeForRole } from '$lib/routes';
	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';

	const menuItems: MenuItem[] = [
		{
			id: 'accueil',
			path: homeForRole(RoleEnum.AdminStructure),
			label: 'Accueil',
		},
	];
</script>

<Header {menuItems} />

<div class="fr-container fr-mb-8w">
	<slot />
</div>

<Footer />
