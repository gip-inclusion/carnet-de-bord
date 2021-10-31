<script type="ts" context="module">
	import { FooterCDB, HeaderCDB, LayerCDB } from '$lib/ui';

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

<script type="ts">
	import type { MenuItem } from '$lib/types';

	const menuItems: MenuItem[] = [
		{
			id: 'accueil',
			path: '/admin',
			label: 'Accueil',
		},
	];
</script>

<HeaderCDB {menuItems} />

<div class="fr-container  fr-py-6w fr-px-2w" style="min-height: calc(100vh - 200px)">
	<div class="py-4 px-40 space-y-4">
		<slot />
	</div>
	<LayerCDB />
</div>

<FooterCDB />
