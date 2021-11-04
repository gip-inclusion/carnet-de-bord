<script lang="ts" context="module">
	import redirectUrl from '$lib/utils/redirectUrl';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	export async function load({ page, session }: LoadInput): Promise<LoadOutput> {
		const redirect = redirectUrl(page, session);
		if (redirect) {
			return {
				status: 302,
				redirect,
			};
		}
		return {};
	}
</script>

<script lang="ts">
	import LayerCDB from '$lib/ui/LayerCDB.svelte';
	import type { MenuItem } from '$lib/types';
	import { HeaderCDB, FooterCDB } from '$lib/ui/index';

	const menuItems: MenuItem[] = [
		{
			id: 'utilisateurs',
			path: '/manager/utilisateurs',
			label: 'Utilisateurs',
		},
		{ id: 'structures', path: '/manager/structures', label: 'Structures' },
	];
</script>

<HeaderCDB {menuItems} />

<div class="fr-container" style="min-height: calc(100vh - 200px)">
	<slot />
	<LayerCDB />
</div>

<FooterCDB />
