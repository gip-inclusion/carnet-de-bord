<script lang="ts">
	import {
		educationLevelKeys,
		geographicalAreaKeys,
		rsaRightKeys,
		workSituationKeys,
	} from '$lib/constants/keys';
	import type { Notebook } from '$lib/graphql/_gen/typed-document-nodes';
	import { pluralize } from '$lib/helpers';
	import { openComponent } from '$lib/stores';
	import { formatDateLocale } from '$lib/utils/date';
	import { Button } from '../base';
	import { Text } from '../utils';
	import ProCarnetSocioProUpdate from './ProNotebookSocioProUpdate.svelte';

	export let notebook: Pick<
		Notebook,
		| 'workSituation'
		| 'workSituationDate'
		| 'rightAre'
		| 'rightAss'
		| 'rightBonus'
		| 'rightRqth'
		| 'rightRsa'
		| 'geographicalArea'
		| 'educationLevel'
	> & { wantedJobs: { rome_code: { label: string; id: string } }[] };

	const editSocioProSituation = () => {
		openComponent.open({
			component: ProCarnetSocioProUpdate,
			props: {
				notebook: {
					...notebook,
					wantedJobs: notebook.wantedJobs.map(({ rome_code }) => rome_code.id),
				},
				options: notebook.wantedJobs.map(({ rome_code }) => rome_code),
			},
		});
	};
</script>

<div class="flex flex-col space-y-6">
	{#if notebook.workSituationDate && notebook.workSituation}
		<div>
			<strong>{workSituationKeys.byKey[notebook.workSituation]}</strong> depuis le {formatDateLocale(
				notebook.workSituationDate
			)}
		</div>
	{/if}

	<div class="flex flex-row flex-wrap">
		<div class="w-1/2">
			<strong class="text-base text-france-blue">Droits</strong>
			<Text classNames="mb-2" value={`RSA - ${rsaRightKeys.byKey[notebook.rightRsa]}`} />
			{#if [notebook.rightRqth, notebook.rightAre, notebook.rightBonus, notebook.rightAss].filter( (field) => Boolean(field) ).length > 0}
				<p>
					{[
						notebook.rightRqth && 'RQTH',
						notebook.rightAre && 'ARE',
						notebook.rightAss && 'ASS',
						notebook.rightBonus && 'Bonus',
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
				classNames="mb-2"
				value={notebook.wantedJobs.map(({ rome_code }) => rome_code.label).join(', ')}
			/>
		</div>
		<div class="w-1/2">
			<strong class="text-base text-france-blue">Zone de mobilité</strong>
			<Text classNames="mb-2" value={geographicalAreaKeys.byKey[notebook.geographicalArea]} />
		</div>
		<div class="w-1/2">
			<strong class="text-base text-france-blue">Niveau de formation</strong>
			<Text classNames="mb-2" value={educationLevelKeys.byKey[notebook.educationLevel]} />
		</div>
	</div>
	<Button classNames="self-start" on:click={() => editSocioProSituation()} outline
		>Mettre à jour</Button
	>
</div>
