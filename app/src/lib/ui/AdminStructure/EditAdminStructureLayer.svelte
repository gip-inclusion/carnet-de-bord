<script lang="ts">
	import { openComponent } from '$lib/stores';
	import type { AdminStructureAccountInput } from './adminStructure.schema';
	import type { AdminStructure } from '$lib/graphql/_gen/typed-document-nodes';
	import AdminStructureForm from './CreationForm.svelte';
	import Alert from '../base/Alert.svelte';

	export let adminStructure: Pick<
		AdminStructure,
		'id' | 'firstname' | 'lastname' | 'phoneNumbers' | 'email'
	>;

	let errorMessage = '';

	function closeLayer() {
		openComponent.close();
	}

	async function editAdminSubmitHandler(data: AdminStructureAccountInput) {
		console.log(data);
		console.log(adminStructure);
		try {
			closeLayer();
		} catch (error) {
			console.error(error);
			errorMessage = 'Impossible de modifier cet admin';
		}
	}
</script>

<div class="flex flex-col gap-6">
	<div>
		<h1>Mettre à jour les informations du gestionnaire de structure</h1>
	</div>
	<AdminStructureForm
		initialValues={adminStructure}
		onSubmit={editAdminSubmitHandler}
		onCancel={closeLayer}
		submitLabel="Enregistrer les modifications"
	/>
	{#if errorMessage}
		<div class="mb-8">
			<Alert type="error" description={errorMessage} />
		</div>
	{/if}
</div>
