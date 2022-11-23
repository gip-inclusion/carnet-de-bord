<script lang="ts">
	import {
		type GetNotebookByBeneficiaryIdQuery,
		type GetNotebookQuery,
		ChangeBeneficiaryOrientationDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { mutation } from '@urql/svelte';
	import OrientationForm, {
		type OrientationValidationSchema,
	} from '../OrientationManager/OrientationForm.svelte';

	export let notebook:
		| GetNotebookByBeneficiaryIdQuery['notebook'][0]
		| GetNotebookQuery['notebook'];
	let error = false;
	const formTitle = notebook.notebookInfo?.needOrientation ? 'Orienter' : 'Réorienter';

	const changeBeneficiaryOrientation = mutation({ query: ChangeBeneficiaryOrientationDocument });

	async function handleSubmit(values: OrientationValidationSchema) {
		const response = await changeBeneficiaryOrientation({
			orientationType: values.orientationType,
			notebookId: notebook.id,
			beneficiaryId: notebook.beneficiary.id,
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

<OrientationForm {handleSubmit} {error} {formTitle} />
