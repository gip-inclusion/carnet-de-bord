<script lang="ts">
	import { accountData, openComponent } from '$lib/stores';
	import AdminStructureAccountEdit from '$lib/ui/AdminStructure/AccountEdit.svelte';
	import AdminStructureView from '$lib/ui/AdminStructure/View.svelte';
	import { Button } from '$lib/ui/base';
	import { Breadcrumbs } from '$lib/ui/base';
	import { homeForRole, type Segment } from '$lib/routes';
	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';

	function editAccount() {
		openComponent.open({
			component: AdminStructureAccountEdit,
		});
	}

	const breadcrumbs: Segment[] = [
		{
			name: 'accueil',
			path: homeForRole(RoleEnum.AdminStructure),
			label: 'Accueil',
		},
		{
			name: 'profile',
			path: '',
			label: 'Mon compte',
		},
	];
</script>

<svelte:head>
	<title>Mon compte - Carnet de bord</title>
</svelte:head>

<Breadcrumbs segments={breadcrumbs} />

<h1>Mon compte</h1>
<AdminStructureView adminStructure={$accountData.admin_structure} />
<div class="pt-8">
	<Button on:click={editAccount} outline={true}>Mettre à jour</Button>
</div>
