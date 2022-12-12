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
		| GetNotebookQuery['notebook'][0]['notebook'];
	export let onBeneficiaryOrientationChanged: () => void;
	export let orientationRequestId: string | undefined;

	let displayError = false;
	const formTitle = notebook.notebookInfo?.needOrientation ? 'Orienter' : 'Réorienter';

	async function handleSubmit(values: OrientationValidationSchema) {
		try {
			await postApiJson(
				'/v1/change-beneficiary-orientation',
				{
					orientation_request_id: orientationRequestId,
					orientation_type: values.orientationType,
					notebook_id: notebook.id,
					beneficiary_id: notebook.beneficiaryId,
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
		onBeneficiaryOrientationChanged();
		openComponent.close();
	}
</script>

<OrientationForm {handleSubmit} {displayError} {formTitle} />
