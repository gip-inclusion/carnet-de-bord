<script lang="ts">
	import type {
		GetNotebookByBeneficiaryIdQuery,
		GetNotebookQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { token } from '$lib/stores';
	import { openComponent } from '$lib/stores';
	import { postApiJson } from '$lib/utils/post';
	import OrientationForm, {
		type OrientationValidationSchema,
	} from '../OrientationManager/OrientationForm.svelte';

	export let notebook:
		| GetNotebookByBeneficiaryIdQuery['notebook'][0]
		| GetNotebookQuery['notebook'];
	let displayError = false;
	const formTitle = notebook.notebookInfo?.needOrientation ? 'Orienter' : 'Réorienter';

	async function handleSubmit(values: OrientationValidationSchema) {
		try {
			await postApiJson(
				'/v1/change-beneficiary-orientation',
				{
					orientation_type: values.orientationType,
					notebook_id: notebook.id,
					beneficiary_id: notebook.beneficiary.id,
					structure_id: values.structureId,
					professional_account_id: values.professionalAccountId,
				},
				{ 'jwt-token': $token }
			);
		} catch (err) {
			console.error(err);
			displayError = true;
			return;
		}
		openComponent.close();
	}
</script>

<OrientationForm {handleSubmit} {displayError} {formTitle} />
