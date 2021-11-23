<script lang="ts">
	import type { MenuItem } from '$lib/types';
	import { FooterCDB, HeaderCDB, LayerCDB } from '$lib/ui';

	const menuItems: MenuItem[] = [
		{
			id: 'accueil',
			path: '/admin',
			label: 'Accueil',
		},
	];
</script>

<HeaderCDB {menuItems} />
<div class="fr-container fr-mb-8w">
	<slot />
	<LayerCDB />
</div>

<FooterCDB />
