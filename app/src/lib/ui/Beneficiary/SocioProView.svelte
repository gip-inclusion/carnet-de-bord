<script lang="ts" context="module">
	import type { ExternalData, GetNotebookQuery } from '$lib/graphql/_gen/typed-document-nodes';

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

	import { Elm as DiagnosticElm } from '$elm/Diagnostic/Main.elm';
	import ElmWrapper from '$lib/utils/ElmWrapper.svelte';
	import { captureException } from '@sentry/svelte';

	const elmSetup = (node: HTMLElement) => {
		const app = DiagnosticElm.Diagnostic.Main.init({
			node,
			flags: {
				professionalSituation: {
					workSituation: notebook.workSituation,
					workSituationDate: notebook.workSituationDate,
					workSituationEndDate: notebook.workSituationEndDate,
					rightRqth: notebook.rightRqth,
					educationLevel: notebook.educationLevel,
					lastJobEndedAt: notebook.lastJobEndedAt,
				},
				professionalProjects: notebook.professionalProjects.map((professionalProject) => ({
					id: professionalProject.id,
					createdAt: professionalProject.createdAt,
					updatedAt: professionalProject.updatedAt,
					mobilityRadius: professionalProject.mobilityRadius,
					rome: professionalProject.rome_code,
					hourlyRate: professionalProject.hourlyRate,
					contractType: professionalProject.contract_type,
					employmentType: professionalProject.employment_type,
					updater: professionalProject.updater,
				})),
				peGeneralData: externalDataDetail?.data?.source || null,
				notebookId: notebook.id,
			},
		});

		app.ports.sendError.subscribe((message: string) => {
			console.error({ message });
			return captureException(new Error(message));
		});
	};
</script>

{#key notebook}
	<ElmWrapper setup={elmSetup} />
{/key}
