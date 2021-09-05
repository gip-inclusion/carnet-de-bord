<script lang="ts">
	import type { MenuItem } from '$lib/ui/base/types';

	import { HeaderCDB, FooterCDB } from '$lib/ui/index';

	const menuItems: MenuItem[] = [
		{
			id: 'utilisateurs',
			path: '/admin/utilisateurs',
			label: 'Utilisateurs'
		},
		{ id: 'structures', path: '/admin/structures', label: 'Structures' }
	];
</script>

<HeaderCDB {menuItems} />

<div class="fr-container" style="min-height: calc(100vh - 200px)">
	<slot />
</div>

<FooterCDB />
