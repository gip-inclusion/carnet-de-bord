<script lang="ts" context="module">
	import type {
		Notebook,
		ExternalData,
		NotebookSituation,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type { Creator } from '../../../../elm/Diagnostic/Main.elm';

	import { formatDateLocale } from '$lib/utils/date';

	export type SocioProInfo = Pick<
		Notebook,
		| 'workSituation'
		| 'workSituationDate'
		| 'workSituationEndDate'
		| 'rightRqth'
		| 'geographicalArea'
		| 'educationLevel'
		| 'lastJobEndedAt'
		| 'id'
	> & {
		professionalProjects: Array<{ rome_code: { id: string; label: string } }>;
		situations: Array<
			Pick<NotebookSituation, 'id' | 'createdAt' | 'refSituation'> & { creator?: Creator }
		>;
	};

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

		const situationsWithFormattedDates = notebook.situations?.map((situation) => {
			return { ...situation, createdAt: formatDateLocale(situation.createdAt) };
		});

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
					professionalProjects: notebook.professionalProjects.map(
						({ rome_code }) => rome_code.label
					),
					lastJobEndedAt: notebook.lastJobEndedAt,
				},
				peGeneralData: externalDataDetail?.data?.source || null,
				personalSituations: situationsWithFormattedDates || null,
			},
		});
	});
</script>

{#key notebook}
	<div class="elm-node">
		<!-- Elm app needs to be wrapped by a div to avoid navigation exceptions when unmounting -->
		<div bind:this={elmNode} />
	</div>
{/key}
