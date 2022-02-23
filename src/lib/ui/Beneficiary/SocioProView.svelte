<script lang="ts">
	import {
		educationLevelKeys,
		geographicalAreaKeys,
		rsaRightKeys,
		workSituationKeys,
	} from '$lib/constants/keys';
	import type { GetNotebookByBeneficiaryIdQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { formatDateLocale } from '$lib/utils/date';
	import { Text } from '../utils';

	export let notebook: GetNotebookByBeneficiaryIdQuery['notebook'][0];
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
			<strong class="text-base text-france-blue">Emploi recherché</strong>
			<Text classNames="mb-2" value={notebook.job} />
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
</div>
