<script lang="ts">
	import AdminDeploymentBeneficiariesImport from '$lib/ui/AdminDeployment/AdminDeploymentBeneficiariesImport.svelte';

	import Dialog from '$lib/ui/Dialog.svelte';
</script>

<svelte:head>
	<title>Import des bénéficiaires - Carnet de bord</title>
</svelte:head>

<div>
	<p>Cliquez sur le bouton ci-dessous pour procéder à l'import des bénéficiaires du RSA.</p>
	<Dialog
		label="Importer des bénéficiaires"
		buttonLabel="Importer des bénéficiaires"
		title="Importer des bénéficiaires"
		size={'large'}
		showButtons={false}
	>
		<AdminDeploymentBeneficiariesImport />
	</Dialog>
</div>
