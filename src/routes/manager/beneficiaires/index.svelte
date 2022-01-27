<script lang="ts">
	import AdminDeploymentBeneficiariesImport from '$lib/ui/AdminDeployment/AdminDeploymentBeneficiariesImport.svelte';

	import Dialog from '$lib/ui/Dialog.svelte';
</script>

<Dialog
	label="Importer des bénéficiaires"
	buttonLabel="Importer des bénéficiaires"
	title="Importer des bénéficiaires"
	size={'large'}
	showButtons={false}
>
	<AdminDeploymentBeneficiariesImport />
</Dialog>
