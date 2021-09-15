<script type="ts">
	import {
		educationLevelKeys,
		geographicalAreaKeys,
		rsaRightKeys,
		workSituationKeys
	} from '$lib/constants/keys';
	import type { Notebook } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { formatDateLocale } from '$lib/utils/date';
	import { Button } from '../base';
	import { Text } from '../utils';
	import ProBeneficiarySocioProUpdate from './ProBeneficiarySocioProUpdate.svelte';

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
		| 'job'
		| 'educationLevel'
	>;

	const editSocioProSituation = () => {
		openComponent.open({
			component: ProBeneficiarySocioProUpdate,
			props: {
				notebook
			}
		});
	};
</script>

<div class="flex flex-col space-y-6">
	{#if notebook.workSituationDate && notebook.workSituation}
		<div class="text-sm">
			<strong>{workSituationKeys.byKey[notebook.workSituation]}</strong> depuis le {formatDateLocale(
				notebook.workSituationDate
			)}
		</div>
	{/if}

	<div class="flex flex-row flex-wrap">
		<div class="w-1/2">
			<strong class="text-base bf-500">Droits</strong>
			<Text classNames="mb-2" value={rsaRightKeys.byKey[notebook.rightRsa]} />
			{#if [notebook.rightRqth, notebook.rightAre, notebook.rightBonus, notebook.rightAss].filter(Boolean).length > 0}
				<p>
					{[
						notebook.rightRqth && 'RQTH',
						notebook.rightAre && 'ARE',
						notebook.rightAss && 'ASS',
						notebook.rightBonus && 'Bonus'
					]
						.filter(Boolean)
						.join(', ')}
				</p>
			{/if}
		</div>

		<div class="w-1/2">
			<strong class="text-base bf-500">Emploi recherché</strong>
			<Text classNames="mb-2" value={notebook.job} />
		</div>
		<div class="w-1/2">
			<strong class="text-base bf-500">Zone géographique</strong>
			<Text classNames="mb-2" value={geographicalAreaKeys.byKey[notebook.geographicalArea]} />
		</div>
		<div class="w-1/2">
			<strong class="text-base bf-500">Diplôme</strong>
			<Text classNames="mb-2" value={educationLevelKeys.byKey[notebook.educationLevel]} />
		</div>
	</div>
	<Button classNames="self-start" on:click={() => editSocioProSituation()} outline
		>Mettre à jour</Button
	>
</div>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}
</style>
