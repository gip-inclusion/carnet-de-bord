<script lang="ts">
	import type { Segment } from '$lib/routes';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import StructureList from './StructureList.svelte';

	const breadcrumbs: Segment[] = [
		{
			name: 'accueil',
			path: '/admin_structure',
			label: 'Accueil',
		},
	];
</script>

<svelte:head>
	<title>Gestion des structures - Carnet de bord</title>
</svelte:head>

<Breadcrumbs segments={breadcrumbs} />

<div class="flex flex-col gap-8">
	<h1 class="fr-h4">Mes structures</h1>

	<StructureList />
</div>
