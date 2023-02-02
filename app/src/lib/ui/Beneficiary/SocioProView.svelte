<script lang="ts" context="module">
	import type { Notebook } from '$lib/graphql/_gen/typed-document-nodes';

	export type SocioProInfo = Pick<
		Notebook,
		| 'workSituation'
		| 'workSituationDate'
		| 'workSituationEndDate'
		| 'rightRqth'
		| 'rightBonus'
		| 'rightAre'
		| 'rightAss'
		| 'rightRsa'
		| 'geographicalArea'
		| 'educationLevel'
	> & { wantedJobs: { rome_code: { id: string; label: string } }[] };
</script>

<script lang="ts">
	export let notebook: SocioProInfo;

	import { Elm as DiagnosticElm } from '../../../../elm/Diagnostic/Main.elm';
	import { afterUpdate } from 'svelte';

	let elmNode: HTMLElement;
	afterUpdate(() => {
		if (!elmNode) return;
		DiagnosticElm.Diagnostic.Main.init({
			node: elmNode,
			flags: {
				rightRsa: notebook.rightRsa,
				workSituation: notebook.workSituation,
				workSituationDate: notebook.workSituationDate,
				workSituationEndDate: notebook.workSituationEndDate,
				rightRqth: notebook.rightRqth,
				rightAre: notebook.rightAre,
				rightAss: notebook.rightAss,
				rightBonus: notebook.rightBonus,
				geographicalArea: notebook.geographicalArea,
				educationLevel: notebook.educationLevel,
				wantedJobs: notebook.wantedJobs.map(({ rome_code }) => rome_code.label),
			},
		});
	});
</script>

{#key notebook}
	<div>
		<!-- Elm app needs to be wrapped by a div to avoid navigation exceptions when unmounting -->
		<div bind:this={elmNode} />
	</div>
{/key}
