<script context="module" lang="ts">
	import { GetAccountByPkQuery, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetAccountByPkDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import { getCrispWebsiteId } from '$lib/config/variables/public';
	import Crisp from '$lib/chat/Crisp.svelte';
	const CRISP_WEBSITE_ID = getCrispWebsiteId();

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
	import { account } from '$lib/stores';
	import type { MenuItem } from '$lib/types';
	import { FooterCDB, HeaderCDB, LayerCDB } from '$lib/ui';
	import { onDestroy } from 'svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { baseUrlForRole, homeForRole } from '$lib/routes';
	import { operationStore, OperationStore, query } from '@urql/svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let result: OperationStore<GetAccountByPkQuery>;

	query(result);

	const unsubscribe = result.subscribe((result) => {
		if (result.data?.account_by_pk.orientation_manager) {
			const { username, onboardingDone, confirmed, id: accountId } = result.data.account_by_pk;
			const { id, firstname, lastname, email, phoneNumbers } =
				result.data.account_by_pk.orientation_manager;
			$account = {
				type: 'orientationManager',
				phoneNumbers,
				accountId,
				id,
				username,
				onboardingDone,
				confirmed,
				firstname,
				lastname,
				email,
			};
			if (!onboardingDone && !/bienvenue/.test($page.url.pathname)) {
				console.log(account);
				goto(`${baseUrlForRole(RoleEnum.OrientationManager)}/bienvenue`);
			}
		}
	});

	onDestroy(unsubscribe);

	const menuItems: MenuItem[] = [
		{
			id: 'accueil',
			path: homeForRole(RoleEnum.OrientationManager),
			label: 'Accueil',
		},
	];
</script>

<Crisp websiteId={CRISP_WEBSITE_ID} />
<HeaderCDB {menuItems} />

<div class="fr-container fr-mb-8w">
	<LoaderIndicator {result}><slot /></LoaderIndicator>
</div>
<LayerCDB />

<FooterCDB />
