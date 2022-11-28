<script lang="ts">
	import type { GetNotebookByBeneficiaryIdQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { token } from '$lib/stores';
	import { openComponent } from '$lib/stores';
	import OrientationForm, {
		type OrientationValidationSchema,
	} from '../OrientationManager/OrientationForm.svelte';
	import { postApiJson } from '$lib/utils/post';

	export let orientationRequest: GetNotebookByBeneficiaryIdQuery['notebook'][0]['beneficiary']['orientationRequest'][0];
	let displayError = false;

	async function handleSubmit(values: OrientationValidationSchema) {
		try {
			await postApiJson(
				'/v1/change-beneficiary-orientation',
				{
					orientation_request_id: orientationRequest.id,
					orientation_type: values.orientationType,
					notebook_id: orientationRequest.beneficiary.notebook.id,
					beneficiary_id: orientationRequest.beneficiary.id,
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

<OrientationForm {displayError} {handleSubmit} />
