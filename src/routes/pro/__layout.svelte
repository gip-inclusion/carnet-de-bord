<script context="module" lang="ts">
	import { account } from '$lib/../stores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { GetAccountQuery } from '$lib/_gen/typed-document-nodes';
	import { GetAccountDocument } from '$lib/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = async ({ session }) => {
		const accountId = session.user.id;
		const result = operationStore(GetAccountDocument, { accountId });

		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	import type { MenuItem } from '$lib/ui/base/types';

	import { Breadcrumbs } from '$lib/ui/base';
	import { getSegments } from '../../routes/routes';
	import { HeaderCDB, FooterCDB } from '$lib/ui/index';

	export let result: OperationStore<GetAccountQuery>;

	query(result);

	$: {
		if ($result.data) {
			if ($result.data.account_by_pk) {
				const { __typename, ...cleanedProfile } = $result.data.account_by_pk.professional;
				$account = {
					...cleanedProfile,
					username: $result.data.account_by_pk.username,
					onboardingDone: $result.data.account_by_pk.onboardingDone,
					confirmed: $result.data.account_by_pk.confirmed
				};
			} else {
				$account = null;
			}

			if (!$result.data.account_by_pk.onboardingDone && $page.path !== '/pro/moncompte') {
				/* @TODO this causes a navigation error with Svelte, this needs to be checked */
				goto('/pro/moncompte');
			}
		}
	}

	const menuItems: MenuItem[] = [
		{ id: 'accueil', name: 'accueil', path: '/pro/accueil', label: 'Accueil' },
		{ id: 'annuaire', name: 'annuaire', path: '/pro/annuaire', label: 'Annuaire des bénéficiaires' }
	];

	$: segments = getSegments($page.path);
</script>

<HeaderCDB {menuItems} />

<div class="fr-container" style="min-height: calc(100vh - 200px)">
	<Breadcrumbs {segments} />
	<slot />
</div>

<FooterCDB />
