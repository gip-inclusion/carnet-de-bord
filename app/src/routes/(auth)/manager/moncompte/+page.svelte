<script lang="ts">
	import { accountData, openComponent } from '$lib/stores';
	import ManagerAccountEdit from '$lib/ui/Manager/AccountEdit.svelte';
	import ManagerView from '$lib/ui/Manager/View.svelte';
	import { Button } from '$lib/ui/base';

	function editAccount() {
		openComponent.open({
			component: ManagerAccountEdit,
		});
	}
</script>

<svelte:head>
	<title>Mon compte - Carnet de bord</title>
</svelte:head>

<h1 class="fr-h2">Mon compte</h1>
<ManagerView manager={$accountData.manager} />
<div>
	<Button on:click={editAccount} outline={true}>Mettre à jour</Button>
</div>
