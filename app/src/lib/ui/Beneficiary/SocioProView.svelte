<script lang="ts" context="module">
	import type { Notebook } from '$lib/graphql/_gen/typed-document-nodes';
	import type { ExternalData } from '$lib/graphql/_gen/typed-document-nodes';

	export type SocioProInfo = Pick<
		Notebook,
		| 'workSituation'
		| 'workSituationDate'
		| 'workSituationEndDate'
		| 'rightRqth'
		| 'geographicalArea'
		| 'educationLevel'
		| 'lastJobEndedAt'
	> & { wantedJobs: { rome_code: { id: string; label: string } }[] };

	export type ExternalDataDetail = Pick<ExternalData, 'data' | 'source'>;
</script>

<script lang="ts">
	export let notebook: SocioProInfo;
	export let externalDataDetail: ExternalDataDetail | null;

	import { Elm as DiagnosticElm } from '../../../../elm/Diagnostic/Main.elm';
	import { afterUpdate } from 'svelte';

	let elmNode: HTMLElement;
	afterUpdate(() => {
		if (!elmNode) return;

		DiagnosticElm.Diagnostic.Main.init({
			node: elmNode,
			flags: {
				professionalSituation: {
					workSituation: notebook.workSituation,
					workSituationDate: notebook.workSituationDate,
					workSituationEndDate: notebook.workSituationEndDate,
					rightRqth: notebook.rightRqth,
					geographicalArea: notebook.geographicalArea,
					educationLevel: notebook.educationLevel,
					wantedJobs: notebook.wantedJobs.map(({ rome_code }) => rome_code.label),
					lastJobEndedAt: notebook.lastJobEndedAt,
				},
				peGeneralData: externalDataDetail?.data?.source || null,
			},
		});
	});
</script>

{#key notebook}
	<!--
  @hack to prevent Svelte from removing CSS classes that we need in Elm and are not used in Svelte
  See https://github.com/sveltejs/svelte/issues/5804 for more details

  shadow-dsfr rounded-lg p-4 pt-10

  -->
	<div class="elm-node">
		<!-- Elm app needs to be wrapped by a div to avoid navigation exceptions when unmounting -->
		<div bind:this={elmNode} />
	</div>
{/key}
