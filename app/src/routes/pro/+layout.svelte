<script context="module" lang="ts">
	throw new Error(
		'@migration task: Check code was safely removed (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292722)'
	);

	// import { goto } from '$app/navigation';
	// import type { GetAccountByPkQuery } from '$lib/graphql/_gen/typed-document-nodes';
	// import { GetAccountByPkDocument } from '$lib/graphql/_gen/typed-document-nodes';
	// import type { MenuItem } from '$lib/types';
	// import Footer from '$lib/ui/base/Footer.svelte';
	// import Header from '$lib/ui/base/Header.svelte';

	// import { LayerCDB } from '$lib/ui/index';
	// import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	// import type { Load } from '@sveltejs/kit';
	// import type { OperationStore } from '@urql/svelte';
	// import { operationStore, query } from '@urql/svelte';
	// import { getCrispWebsiteId } from '$lib/config/variables/public';
	// import Crisp from '$lib/chat/Crisp.svelte';
	// const CRISP_WEBSITE_ID = getCrispWebsiteId();

	// export const load: Load = async ({ session }) => {
	// 	const accountId = session.user.id;
	// 	const result = operationStore(GetAccountByPkDocument, { accountId });

	// 	return {
	// 		props: {
	// 			result,
	// 		},
	// 	};
	// };
</script>

<script lang="ts">
	throw new Error(
		'@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)'
	);

	import { page } from '$app/stores';
	import { account, crispData } from '$lib/stores';

	export let result: OperationStore<GetAccountByPkQuery>;

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
