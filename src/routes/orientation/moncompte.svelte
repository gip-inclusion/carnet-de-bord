<script lang="ts">
	import { openComponent } from '$lib/stores';
	import OrientationManagerAccountEdit from '$lib/ui/OrientationManager/AccountEdit.svelte';
	import OrientationManagerView from '$lib/ui/OrientationManager/View.svelte';
	import { Button } from '$lib/ui/base';
	import { Breadcrumbs } from '$lib/ui/base';
	import type { ConnectedOrientationManager, ConnectedUser } from '$lib/stores/account';
	import { account } from '$lib/stores/account';
	import { homeForRole, Segment } from '$lib/routes';
	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';

	function editAccount() {
		openComponent.open({
			component: OrientationManagerAccountEdit,
			props: { orientationManager: $account },
		});
	}

	const breadcrumbs: Segment[] = [
		{
			name: 'accueil',
			path: homeForRole(RoleEnum.OrientationManager),
			label: 'Accueil',
		},
		{
			name: 'profile',
			path: '',
			label: 'Mon compte',
		},
	];

	function toConnectedOrientationManager(admin: ConnectedUser) {
		return admin as ConnectedOrientationManager;
	}
</script>

<svelte:head>
	<title>Mon compte - Carnet de bord</title>
</svelte:head>

<Breadcrumbs segments={breadcrumbs} />

<h1>Mon compte</h1>
<OrientationManagerView orientationManager={toConnectedOrientationManager($account)} />
<div class="pt-8">
	<Button on:click={editAccount} outline={true}>Mettre à jour</Button>
</div>
