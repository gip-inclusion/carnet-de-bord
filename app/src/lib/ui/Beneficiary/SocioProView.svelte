<script lang="ts" context="module">
	import type {
		Notebook,
		ExternalData,
		NotebookFocus,
	} from '$lib/graphql/_gen/typed-document-nodes';

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
	> & { wantedJobs: { rome_code: { id: string; label: string } }[] };

	export type ExternalDataDetail = Pick<ExternalData, 'data' | 'source'>;

	export type Focus = Pick<NotebookFocus, 'situations' | 'theme'> & {
		createdAt?: string;
		creator: {
			professional?: {
				firstname?: string;
				lastname?: string;
				structure: { name: string };
			};
			orientation_manager?: {
				firstname?: string;
				lastname?: string;
			};
		};
	};
</script>

<script lang="ts">
	export let notebook: SocioProInfo;
	export let externalDataDetail: ExternalDataDetail | null;
	export let focuses: Focus[] | null;

	import { Elm as DiagnosticElm } from '../../../../elm/Diagnostic/Main.elm';
	import { afterUpdate } from 'svelte';

	let elmNode: HTMLElement;
	afterUpdate(() => {
		if (!elmNode) return;

		const focusesWithDates = focuses.map((focus) => {
			return { ...focus, createdAt: formatDateLocale(focus.createdAt) };
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
					wantedJobs: notebook.wantedJobs.map(({ rome_code }) => rome_code.label),
					lastJobEndedAt: notebook.lastJobEndedAt,
				},
				peGeneralData: externalDataDetail?.data?.source || null,
				personalSituations: focusesWithDates || null,
			},
		});
	});
</script>

{#key notebook}
	<!--
  @hack to prevent Svelte from removing CSS classes that we need in Elm and are not used in Svelte
  See https://github.com/sveltejs/svelte/issues/5804 for more details

  shadow-dsfr rounded-lg p-4 pt-10 pt-4 font-normal odd:bg-gray-100 py-8 leading-10 pr-8 pr-4 align-text-top pl-2 py-3

  -->
	<div class="elm-node">
		<!-- Elm app needs to be wrapped by a div to avoid navigation exceptions when unmounting -->
		<div bind:this={elmNode} />
	</div>
{/key}
