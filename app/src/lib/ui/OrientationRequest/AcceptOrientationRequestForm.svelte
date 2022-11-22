<script lang="ts">
	import {
		type GetNotebookByBeneficiaryIdQuery,
		AcceptOrientationRequestDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation } from '@urql/svelte';
	import { openComponent } from '$lib/stores';
	import OrientationForm, {
		type OrientationValidationSchema,
	} from '../OrientationManager/OrientationForm.svelte';

	export let orientationRequest: GetNotebookByBeneficiaryIdQuery['notebook'][0]['beneficiary']['orientationRequest'][0];
	const acceptOrientationRequest = mutation({ query: AcceptOrientationRequestDocument });
	let error = false;

	async function handleSubmit(values: OrientationValidationSchema) {
		const response = await acceptOrientationRequest({
			id: orientationRequest.id,
			orientationType: values.orientationType,
			notebookId: orientationRequest.beneficiary.notebook.id,
			beneficiaryId: orientationRequest.beneficiary.id,
			structureId: values.structureId,
			professionalAccountId: values.professionalAccountId,
			withProfessionalAccountId: !!values.professionalAccountId,
		});
		if (response.error) {
			error = true;
			console.error(error);
			return;
		}
		openComponent.close();
	}
</script>

<OrientationForm {error} {handleSubmit} />
