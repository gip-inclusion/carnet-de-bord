<script lang="ts">
	import { homeForRole } from '$lib/routes';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';

	import {
		createSelectionStore,
		selectionContextKey,
	} from '$lib/ui/BeneficiaryList/MultipageSelectionStore';
	import Container from '$lib/ui/BeneficiaryList/Container.svelte';
	import { setContext } from 'svelte';
	import type { PageData } from './$types';
	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';

	export let data: PageData;

	let breadcrumbs = [
		{
			name: 'accueil',
			path: homeForRole(RoleEnum.Manager),
			label: 'Accueil',
		},
		{
			name: 'structure',
			path: '',
			label: `bénéficiaires`,
		},
	];
	setContext(selectionContextKey, createSelectionStore());
</script>

<svelte:head>
	<title>Liste des bénéficiaires - Carnet de bord</title>
</svelte:head>
<Breadcrumbs segments={breadcrumbs} />
<h1>Bénéficiaires</h1>
<Container
	listType="orientation"
	search={data.search}
	currentPage={data.currentPage}
	beneficiaryFilter={data.beneficiaryFilter}
	withoutOrientationManager={data.withoutOrientationManager}
	orientationStatusFilter={data.orientationStatusFilter}
/>
