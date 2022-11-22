<script lang="ts">
	import {
		type GetNotebookByBeneficiaryIdQuery,
		type GetNotebookQuery,
		ChangeBeneficiaryOrientationDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { Button } from '$lib/ui/base';
	import { openComponent } from '$lib/stores';
	import { mutation } from '@urql/svelte';
	import OrientationForm, {
		type OrientationValidationSchema,
	} from '../OrientationManager/OrientationForm.svelte';

	export let notebook:
		| GetNotebookByBeneficiaryIdQuery['notebook'][0]
		| GetNotebookQuery['notebook'];
	$: error = false; // FIXME: find correct way to update open component when error changes
	const buttonTitle = notebook.notebookInfo?.needOrientation ? 'Orienter' : 'Réorienter';

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

	function openOrientationForm() {
		openComponent.open({
			component: OrientationForm,
			props: {
				handleSubmit,
				formTitle: buttonTitle,
				error,
			},
		});
	}
</script>

<div class="flex flex-row mb-8 items-center">
	<div class="flex flex-row flex-none items-center gap-6 h-8">
		<Button title={buttonTitle} on:click={() => openOrientationForm()}>{buttonTitle}</Button>
	</div>
</div>
