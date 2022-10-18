<script lang="ts">
	import { account, openComponent } from '$lib/stores';
	import AdminStructureAccountEdit from '$lib/ui/AdminStructure/AccountEdit.svelte';
	import AdminStructureView from '$lib/ui/AdminStructure/View.svelte';
	import { Button } from '$lib/ui/base';
	import { Breadcrumbs } from '$lib/ui/base';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { ConnectedAdminStructure, ConnectedUser } from '$lib/stores/account';
	import { baseUrlForRole, homeForRole, type Segment } from '$lib/routes';
	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';

	function editAccount() {
		openComponent.open({
			component: AdminStructureAccountEdit,
			props: { adminStructure: $account },
		});
	}

	onMount(() => {
		if (!$account.onboardingDone) {
			goto(`${baseUrlForRole('admin_structure')}/bienvenue`);
		}
	});

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
	function toConnectedAdminStructure(admin: ConnectedUser) {
		return admin as ConnectedAdminStructure;
	}
</script>

<svelte:head>
	<title>Mon compte - Carnet de bord</title>
</svelte:head>

<Breadcrumbs segments={breadcrumbs} />

<h1>Mon compte</h1>
<AdminStructureView adminStructure={toConnectedAdminStructure($account)} />
<div class="pt-8">
	<Button on:click={editAccount} outline={true}>Mettre à jour</Button>
</div>
