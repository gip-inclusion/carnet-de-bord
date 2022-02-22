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
	import type { MenuItem } from '$lib/types';
	import { FooterCDB, HeaderCDB, LayerCDB } from '$lib/ui';

	import { page } from '$app/stores';
	import { account } from '$lib/stores';

	export let result: OperationStore<GetAccountByPkQuery>;

	query(result);

	result.subscribe((result) => {
		if (result.data) {
			const acc = result.data.account_by_pk;
			if (acc) {
				const { username, onboardingDone, confirmed, id: accountId } = acc;
				const { id, firstname, lastname, email } = acc.manager;
				$account = {
					type: 'manager',
					accountId,
					id,
					username,
					onboardingDone,
					confirmed,
					firstname,
					lastname,
					email,
				};

				if (!onboardingDone && $page.url.pathname !== '/manager/moncompte') {
					goto('/manager/moncompte');
				}
			}
		}
	});

	const menuItems: MenuItem[] = [
		{ id: 'home', path: '/manager', label: 'Accueil' },
		// { id: 'beneficiaires', path: '/manager/beneficiaires', label: 'BRSA' },
		/* { */
		/*   id: 'utilisateurs', */
		/*   path: '/manager/utilisateurs', */
		/*   label: 'Utilisateurs', */
		/* }, */
		{ id: 'structures', path: '/manager/structures', label: 'Structures' },
		// { id: 'statistiques', path: '/manager/statistiques', label: 'Statistiques' },
	];
</script>

<HeaderCDB {menuItems} />

<div class="fr-container fr-py-6w fr-px-2w" style="min-height: calc(100vh - 200px)">
	<div class="flex flex-col gap-8 md:px-40 sm:px-20 px-10">
		<slot />
	</div>
	<LayerCDB />
</div>

<FooterCDB />
