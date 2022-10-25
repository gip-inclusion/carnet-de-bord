<script lang="ts">
	import { openComponent } from '$lib/stores';
	import OrientationManagerAccountEdit from '$lib/ui/OrientationManager/AccountEdit.svelte';
	import OrientationManagerView from '$lib/ui/OrientationManager/View.svelte';
	import { Button } from '$lib/ui/base';
	import { Breadcrumbs } from '$lib/ui/base';
	import { accountData } from '$lib/stores/account';
	import { homeForRole, type Segment } from '$lib/routes';
	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';

	function editAccount() {
		openComponent.open({
			component: OrientationManagerAccountEdit,
			props: { orientationManager: $accountData },
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
</script>

<svelte:head>
	<title>Mon compte - Carnet de bord</title>
</svelte:head>

<Breadcrumbs segments={breadcrumbs} />

<h1>Mon compte</h1>
<OrientationManagerView orientationManager={$accountData.orientation_manager} />
<div class="pt-8">
	<Button on:click={editAccount} outline={true}>Mettre à jour</Button>
</div>
