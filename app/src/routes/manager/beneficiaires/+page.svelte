<script lang="ts">
	throw new Error(
		'@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)'
	);

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
	export let member: string;

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
<Container listType="manager" {filter} {search} {currentPage} {member} />
