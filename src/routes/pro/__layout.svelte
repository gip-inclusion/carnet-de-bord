<script context="module" lang="ts">
	import { goto } from '$app/navigation';
	import type { GetAccountQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetAccountDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { MenuItem } from '$lib/types';
	import { FooterCDB, HeaderCDB } from '$lib/ui/index';
	import LayerCDB from '$lib/ui/LayerCDB.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = async ({ session }) => {
		const accountId = session.user.id;
		const result = operationStore(GetAccountDocument, { accountId });

		return {
			props: {
				result,
			},
		};
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { account, openComponent } from '$lib/stores';

	export let result: OperationStore<GetAccountQuery>;

	query(result);

	result.subscribe((result) => {
		if (result.data) {
			const acc = result.data.account_by_pk;
			if (acc) {
				const { username, onboardingDone, confirmed } = acc;
				const { firstname, lastname, email, mobileNumber, position } = acc.professional;
				$account = {
					username,
					onboardingDone,
					confirmed,
					firstname,
					lastname,
					email,
					mobileNumber,
					position,
				};

				if (!onboardingDone && $page.path !== '/pro/moncompte') {
					goto('/pro/moncompte');
				}
			}
		}
	});

	const menuItems: MenuItem[] = [
		{ id: 'accueil', path: '/pro/accueil', label: 'Accueil' },
		{ id: 'annuaire', path: '/pro/annuaire', label: 'Annuaire des bénéficiaires' },
	];
</script>

<HeaderCDB {menuItems} />

<div class="fr-container" style="min-height: calc(100vh - 200px)">
	<LoaderIndicator {result}>
		<slot />
		<LayerCDB {openComponent} />
	</LoaderIndicator>
</div>

<FooterCDB />
