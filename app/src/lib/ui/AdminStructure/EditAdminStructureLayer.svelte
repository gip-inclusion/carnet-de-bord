<script lang="ts">
	import { openComponent } from '$lib/stores';
	import type {
		AdminStructure,
		AdminStructureSetInput,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore } from '@urql/svelte';
	import { UpdateAdminStructureByIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import AdminStructureForm from './AdminStructureForm.svelte';
	import Alert from '../base/Alert.svelte';

	export let adminStructure: Pick<
		AdminStructure,
		'id' | 'firstname' | 'lastname' | 'phoneNumbers' | 'email'
	>;

	let errorMessage = '';

	function closeLayer() {
		openComponent.close();
	}

	const updateAdminStructureStore = operationStore(UpdateAdminStructureByIdDocument);
	const updateAdminStructure = mutation(updateAdminStructureStore);

	async function editAdminSubmitHandler(obj: AdminStructureSetInput) {
		try {
			await updateAdminStructure({ id: adminStructure.id, obj });
			closeLayer();
		} catch (error) {
			console.error(error);
			errorMessage = 'Impossible de modifier ce gestionnaire';
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
