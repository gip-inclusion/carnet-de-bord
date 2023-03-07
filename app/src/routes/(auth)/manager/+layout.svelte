<script lang="ts">
	import type { MenuItem } from '$lib/types';
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';
	import NPSRating from '$lib/ui/NPSRating/NPSRating.svelte';
	import { baseUrlForRole, homeForRole } from '$lib/routes';
	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';

	const menuItems: MenuItem[] = [
		{ id: 'home', path: homeForRole(RoleEnum.Manager), label: 'Accueil' },
		{
			id: 'beneficiaires',
			path: `${baseUrlForRole('manager')}/beneficiaires`,
			label: 'Bénéficiaires',
		},
		{ id: 'structures', path: `${baseUrlForRole('manager')}/structures`, label: 'Structures' },
		{ id: 'pro', path: `${baseUrlForRole('manager')}/professionnels`, label: 'Professionnels' },
	];
</script>

<Header {menuItems} />

<div class="fr-container fr-pb-6w fr-px-2w" style="min-height: calc(100vh - 200px)">
	<slot />
	<NPSRating />
</div>

<Footer />
