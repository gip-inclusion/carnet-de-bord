<script lang="ts">
	import { page } from '$app/stores';
	import { account, crispData } from '$lib/stores';
	import Crisp from '$lib/chat/Crisp.svelte';
	import { GetAccountByPkDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { getCrispWebsiteId } from '$lib/config/variables/public';
	import { operationStore, query } from '@urql/svelte';

	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';
	import type { MenuItem } from '$lib/types';
	import Header from '$lib/ui/base/Header.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { LayerCDB } from '$lib/ui';
	import Footer from '$lib/ui/base/Footer.svelte';

	const CRISP_WEBSITE_ID = getCrispWebsiteId();

	export let data: LayoutData;
	const result = operationStore(GetAccountByPkDocument, { accountId: data.accountId });
	query(result);

	result.subscribe((result) => {
		if (result.data) {
			const acc = result.data.account_by_pk;
			if (!acc) {
				goto('/auth/logout');
			}
			const { username, onboardingDone, confirmed, id: accountId } = acc;
			const { id, firstname, lastname, email, mobileNumber, position, structure } =
				acc.professional;
			$account = {
				type: 'pro',
				id,
				accountId,
				username,
				onboardingDone,
				confirmed,
				firstname,
				lastname,
				email,
				mobileNumber,
				position,
			};
			crispData.set({ username, firstname, lastname, email, mobileNumber, position, structure });
			if (!onboardingDone && $page.url.pathname !== '/pro/moncompte') {
				goto('/pro/moncompte');
			}
		}
	});

	const menuItems: MenuItem[] = [
		{ id: 'accueil', path: '/pro/accueil', label: 'Accueil' },
		{ id: 'annuaire', path: '/pro/annuaire', label: 'Annuaire de mes bénéficiaires' },
	];
</script>

<Crisp websiteId={CRISP_WEBSITE_ID} />
<Header {menuItems} />

<div class="fr-container fr-py-6w fr-px-2w">
	<div class="flex flex-col gap-8">
		<LoaderIndicator {result}>
			<slot />
		</LoaderIndicator>
	</div>
	<LayerCDB />
</div>

<Footer />
