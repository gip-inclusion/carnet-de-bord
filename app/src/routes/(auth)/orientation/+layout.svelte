<script lang="ts">
	import {
		BeneficiariesWithOrientationRequestCountDocument,
		RoleEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { baseUrlForRole, homeForRole } from '$lib/routes';
	import { accountData } from '$lib/stores';
	import type { MenuItem } from '$lib/types';
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';
	import { operationStore, query } from '@urql/svelte';
	import { onDestroy } from 'svelte';

	let menuItems: MenuItem[] = [
		{
			id: 'accueil',
			path: homeForRole(RoleEnum.OrientationManager),
			label: 'Accueil',
		},
		{
			id: 'beneficiaires',
			path: `${baseUrlForRole($accountData.type)}/beneficiaires`,
			label: 'Bénéficiaires',
		},
	];

	const beneficiariesWithOrientationRequestCountQuery = operationStore(
		BeneficiariesWithOrientationRequestCountDocument
	);
	const result = query(beneficiariesWithOrientationRequestCountQuery);

	const unsubscribe = result.subscribe(({ data }) => {
		if (data?.count.aggregate.count > 0) {
			menuItems = [
				...menuItems,
				{
					id: 'demandes',
					path: '/orientation/demandes',
					label: 'Demandes de réorientation',
				},
			];
		}
	});

	onDestroy(unsubscribe);
</script>

<Header {menuItems} />
<div class="fr-container">
	<slot />
</div>

<Footer />
