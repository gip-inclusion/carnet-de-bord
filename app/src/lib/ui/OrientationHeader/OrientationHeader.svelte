<script lang="ts">
	import type {
		GetNotebookByBeneficiaryIdQuery,
		GetNotebookQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { Button } from '$lib/ui/base';
	import { openComponent } from '$lib/stores';
	import OrientationForm, {
		type OrientationValidationSchema,
	} from '../OrientationManager/OrientationForm.svelte';

	export let notebook:
		| GetNotebookByBeneficiaryIdQuery['notebook'][0]
		| GetNotebookQuery['notebook'];
	$: error = false;
	const buttonTitle = notebook.notebookInfo?.needOrientation ? 'Orienter' : 'Réorienter';

	async function handleSubmit(values: OrientationValidationSchema) {
		console.debug({ values, notebook });
		error = true;
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
