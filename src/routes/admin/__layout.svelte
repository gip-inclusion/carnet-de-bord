<script lang="ts">
	import type { MenuItem } from '$lib/ui/base/types';

	import { Breadcrumbs } from '$lib/ui/base';
	import { page } from '$app/stores';
	import { getSegments } from '$lib/routes';
	import { HeaderCDB, FooterCDB } from '$lib/ui/index';

	const menuItems: MenuItem[] = [
		{
			id: 'utilisateurs',
			path: '/admin/utilisateurs',
			label: 'Utilisateurs'
		},
		{ id: 'structures', path: '/admin/structures', label: 'Structures' }
	];

	$: segments = getSegments($page.path);
</script>

<HeaderCDB {menuItems} />

<div class="fr-container" style="min-height: calc(100vh - 200px)">
	<Breadcrumbs {segments} />
	<slot />
</div>

<FooterCDB />
