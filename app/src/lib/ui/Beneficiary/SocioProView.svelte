<script lang="ts" context="module">
	import type { ExternalData, GetNotebookQuery } from '$lib/graphql/_gen/typed-document-nodes';

	import { formatDateLocale } from '$lib/utils/date';

	export type SocioProInfo = Pick<
		GetNotebookQuery['notebook_public_view'][number]['notebook'],
		| 'workSituation'
		| 'workSituationDate'
		| 'workSituationEndDate'
		| 'rightRqth'
		| 'educationLevel'
		| 'lastJobEndedAt'
		| 'id'
		| 'professionalProjects'
		| 'situations'
	>;

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
					educationLevel: notebook.educationLevel,
					lastJobEndedAt: notebook.lastJobEndedAt,
				},
				professionalProjects: notebook.professionalProjects.map(
					({
						rome_code,
						id,
						mobilityRadius,
						createdAt,
						updatedAt,
						contract_type,
						employment_type,
						hourlyRate,
					}) => ({
						id,
						createdAt,
						updatedAt,
						mobilityRadius,
						rome: rome_code,
						hourlyRate,
						contractType: contract_type,
						employmentType: employment_type,
					})
				),
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
