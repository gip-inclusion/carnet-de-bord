<script lang="ts">
	import { accountData, openComponent } from '$lib/stores';
	import ProAccountEdit from '$lib/ui/ProAccount/ProAccountEdit.svelte';
	import ProWithStructureView from '$lib/ui/ProNotebookMember/ProWithStructureView.svelte';
	import { Button } from '$lib/ui/base';

	function editAccount() {
		openComponent.open({
			component: ProAccountEdit,
		});
	}
</script>

<svelte:head>
	<title>Mon compte - Carnet de bord</title>
</svelte:head>

<h1 class="fr-h2">Mon compte</h1>
<ProWithStructureView account={$accountData} proFirst mainTitle="Informations personnelles" />
<div>
	<Button on:click={editAccount} outline={true}>Mettre à jour</Button>
</div>
