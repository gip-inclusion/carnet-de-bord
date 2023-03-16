<script lang="ts">
	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import { baseUrlForRole, homeForRole } from '$lib/routes';
	import { accountData } from '$lib/stores';
	import type { MenuItem } from '$lib/types';
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';
	import NPSRating from '$lib/ui/NPSRating/NPSRating.svelte';

	const menuItems: MenuItem[] = [
		{
			id: 'accueil',
			path: homeForRole(RoleEnum.OrientationManager),
			label: 'Accueil',
		},
		{
			id: 'beneficiaires',
			path: `${baseUrlForRole($accountData.type)}/beneficiaires`,
			label: 'Bénéficiaires',
		},
	];
</script>

<Header {menuItems} />
<div class="fr-container">
	<slot />
	<NPSRating />
</div>

<Footer />
