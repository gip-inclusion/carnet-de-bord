<script context="module" lang="ts">
	import { goto } from '$app/navigation';
	import type { GetAccountByPkQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetAccountByPkDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = async ({ session }) => {
		const accountId = session.user.id;
		const result = operationStore(GetAccountByPkDocument, { accountId });

		return {
			props: {
				result,
			},
		};
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { account } from '$lib/stores';
	import type { MenuItem } from '$lib/types';
	import { FooterCDB, HeaderCDB, LayerCDB } from '$lib/ui';
	import { onDestroy } from 'svelte';

	export let result: OperationStore<GetAccountByPkQuery>;

	query(result);

	const unsubscribe = result.subscribe((result) => {
		if (result.data?.account_by_pk.admin_structure) {
			const { username, onboardingDone, confirmed, id } = result.data.account_by_pk;
			if (!onboardingDone && $page.url.pathname !== '/manager/moncompte') {
				goto('/manager/moncompte');
			}
			const { firstname, lastname, email } = result.data.account_by_pk.admin_structure;
			$account = { id, username, onboardingDone, confirmed, firstname, lastname, email };
		}
	});

	onDestroy(unsubscribe);

	const menuItems: MenuItem[] = [
		{
			id: 'accueil',
			path: '/admin_structure',
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
