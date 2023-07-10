<script lang="ts">
	import { Elm as DiagnosticPE } from '$elm/Pages/Carnet/Diagnostic/PoleEmploi/Main.elm';

	import ElmWrapper from '$lib/utils/ElmWrapper.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const elmSetup = (node: HTMLElement) => {
		DiagnosticPE.Pages.Carnet.Diagnostic.PoleEmploi.Main.init({
			node,
			flags: {
				notebookId: data.notebookId,
			},
		});
	};
</script>

<ElmWrapper setup={elmSetup} />
