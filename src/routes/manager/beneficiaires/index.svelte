<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ url }) => {
		const params = url.searchParams;
		return {
			props: {
				currentPage: parseInt(params.get('page') ?? '1', 10),
				filter: getFilter(params.get('filter')),
				search: params.get('search') ?? '',
			},
		};
	};
</script>

<script lang="ts">
	import type { MemberFilter } from '$lib/ui/BeneficiaryList/Filters.svelte';
	import { homeForRole } from '$lib/routes';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import { getFilter } from '$lib/ui/BeneficiaryList/Filters.svelte';
	import {
		createSelectionStore,
		selectionContextKey,
	} from '$lib/ui/BeneficiaryList/MultipageSelectionStore';
	import Container from '$lib/ui/BeneficiaryList/Container.svelte';
	import { setContext } from 'svelte';

	export let search: string;
	export let filter: MemberFilter;
	export let currentPage: number;

	let breadcrumbs = [
		{
			name: 'accueil',
			path: homeForRole('manager'),
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
<Container listType="manager" {filter} {search} {currentPage} />
