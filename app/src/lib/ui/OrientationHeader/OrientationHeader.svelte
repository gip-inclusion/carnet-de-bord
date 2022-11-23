<script lang="ts">
	import type {
		GetNotebookByBeneficiaryIdQuery,
		GetNotebookQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { Button } from '$lib/ui/base';
	import { openComponent } from '$lib/stores';
	import ChangeOrientationForm from '../OrientationRequest/ChangeOrientationForm.svelte';

	export let notebook:
		| GetNotebookByBeneficiaryIdQuery['notebook'][0]
		| GetNotebookQuery['notebook'];
	$: buttonTitle = notebook.notebookInfo?.needOrientation ? 'Orienter' : 'Réorienter';

	function openChangeOrientationForm() {
		openComponent.open({ component: ChangeOrientationForm, props: { notebook } });
	}
</script>

<div class="flex flex-row mb-8 items-center">
	<div class="flex flex-row flex-none items-center gap-6 h-8">
		<Button title={buttonTitle} on:click={() => openChangeOrientationForm()}>{buttonTitle}</Button>
	</div>
</div>
