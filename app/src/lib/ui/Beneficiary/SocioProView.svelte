<script lang="ts">
	import {
		educationLevelKeys,
		geographicalAreaKeys,
		rsaRightKeys,
		workSituationKeys,
	} from '$lib/constants/keys';
	import type { GetNotebookByBeneficiaryIdQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { pluralize } from '$lib/helpers';
	import { dateInterval, formatDateLocale } from '$lib/utils/date';
	import { Text } from '../utils';

	export let notebook: GetNotebookByBeneficiaryIdQuery['notebook'][0];

	function contractDatesTemplating(start: string, end: string) {
		if (end) {
			return `depuis le ${formatDateLocale(start)} jusqu'au ${formatDateLocale(end)}`;
		}
		return `depuis le ${formatDateLocale(start)}`;
	}
</script>

<div class="flex flex-col space-y-6">
	<div class="flex flex-row flex-wrap">
		{#if notebook.workSituation}
			<div class="w-1/2">
				<strong>{workSituationKeys.byKey[notebook.workSituation]}</strong>
				{#if notebook.workSituationDate}
					{contractDatesTemplating(notebook.workSituationDate, notebook.workSituationEndDate)}
					{#if notebook.workSituationEndDate}
						-
						<span class="italic font-bold">
							({dateInterval(notebook.workSituationDate, notebook.workSituationEndDate)})
						</span>
					{/if}
				{/if}
			</div>
		{/if}

		{#if notebook.rightRqth}
			<Text class="w-1/2" value="Usager disposant de la RQTH" />
		{/if}
	</div>

	<div class="flex flex-row flex-wrap">
		<div class="w-1/2">
			<strong class="text-base text-france-blue">Droits</strong>
			<Text class="mb-2" value={`RSA - ${rsaRightKeys.byKey[notebook.rightRsa]}`} />
			{#if [notebook.rightAre, notebook.rightBonus, notebook.rightAss].filter( (field) => Boolean(field) ).length > 0}
				<p>
					{[
						notebook.rightAre && 'ARE',
						notebook.rightAss && 'ASS',
						notebook.rightBonus && "Prime d'activité",
					]
						.filter((field) => Boolean(field))
						.join(', ')}
				</p>
			{/if}
		</div>

		<div class="w-1/2">
			<strong class="text-base text-france-blue">
				{pluralize('Emploi', notebook.wantedJobs.length)}
				{pluralize('recherché', notebook.wantedJobs.length)}
			</strong>
			<Text
				class="mb-2"
				value={notebook.wantedJobs.map(({ rome_code }) => rome_code.label).join(', ')}
			/>
		</div>
		<div class="w-1/2">
			<strong class="text-base text-france-blue">Zone de mobilité</strong>
			<Text class="mb-2" value={geographicalAreaKeys.byKey[notebook.geographicalArea]} />
		</div>
		<div class="w-1/2">
			<strong class="text-base text-france-blue">Niveau de formation</strong>
			<Text class="mb-2" value={educationLevelKeys.byKey[notebook.educationLevel]} />
		</div>
	</div>
</div>
