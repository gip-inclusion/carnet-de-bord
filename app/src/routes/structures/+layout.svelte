<script lang="ts">
	import { GetAccountByPkDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import { getCrispWebsiteId } from '$lib/config/variables/public';
	import Crisp from '$lib/chat/Crisp.svelte';
	const CRISP_WEBSITE_ID = getCrispWebsiteId();
	import { account } from '$lib/stores';
	import type { MenuItem } from '$lib/types';
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';

	import { LayerCDB } from '$lib/ui/index';
	import { onDestroy } from 'svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { homeForRole } from '$lib/routes';

	import type { LayoutData } from './$types';

	export let data: LayoutData;
	const result = operationStore(GetAccountByPkDocument, { accountId: data.accountId });

	query(result);

	const unsubscribe = result.subscribe((result) => {
		if (result.data?.account_by_pk.admin_structure) {
			const { username, onboardingDone, confirmed, id: accountId } = result.data.account_by_pk;
			const { id, firstname, lastname, email, phoneNumbers } =
				result.data.account_by_pk.admin_structure;
			$account = {
				type: 'adminStructure',
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
		}
	});

	onDestroy(unsubscribe);

	const menuItems: MenuItem[] = [
		{
			id: 'accueil',
			path: homeForRole('admin_structure'),
			label: 'Accueil',
		},
	];
</script>

<Crisp websiteId={CRISP_WEBSITE_ID} />
<Header {menuItems} />

<div class="fr-container fr-mb-8w">
	<LoaderIndicator {result}>
		<slot />
	</LoaderIndicator>
</div>
<LayerCDB />

<Footer />
