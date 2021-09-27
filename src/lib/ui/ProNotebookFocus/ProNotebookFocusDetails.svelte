<script lang="ts">
	import { contractTypeFullKeys, focusThemeKeys } from '$lib/constants/keys';
	import { GetNotebookFocusByIdDocument, Structure } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { Accordion, Accordions, Button, Card } from '$lib/ui/base';
	import { displayFullName } from '$lib/ui/format';
	import { Text } from '$lib/ui/utils';
	import { operationStore, query } from '@urql/svelte';
	import { ProNotebookActionList } from '../ProNotebookAction';
	import ProNotebookCreatorView from '../ProNotebookCreator/ProNotebookCreatorView.svelte';
	import { ProNotebookStructureList } from '../ProNotebookStructure';
	import ProNotebookTargetCreate from '../ProNotebookTarget/ProNotebookTargetCreate.svelte';
	import ProNotebookFocusUpdate from './ProNotebookFocusUpdate.svelte';

	export let focusId: string;

	const focusStore = operationStore(
		GetNotebookFocusByIdDocument,
		{ id: focusId },
		{
			additionalTypenames: ['notebook_target'],
		}
	);
	query(focusStore);

	const init: Record<string, Pick<Structure, 'id' | 'name'>> = {};

	$: focus = $focusStore.data?.focus;
	$: situations = (focus?.situations as string[]) || [];
	$: targets = focus?.targets || [];

	$: structures = Object.values(
		targets
			?.flatMap(({ actions }) => actions)
			.reduce((acc, { structure }) => {
				return {
					...acc,
					[structure.id]: structure,
				};
			}, init) || {}
	);

	function createTarget() {
		openComponent.open({
			component: ProNotebookTargetCreate,
			props: { focusId: focus?.id, focusTheme: focus?.theme },
		});
	}

	function viewCreator() {
		openComponent.open({
			component: ProNotebookCreatorView,
			props: { creator: focus?.professional, creationDate: focus?.creationDate },
		});
	}

	function viewStructures() {
		openComponent.open({ component: ProNotebookStructureList, props: { structures } });
	}
</script>

{#if focus}
	<div class="flex flex-col gap-6">
		<div>
			<h1 class="mb-0">{focusThemeKeys.byKey[focus?.theme]}</h1>
			<div class="flex justify-between items-center">
				{#if focus?.linkedTo}
					<p class="mb-0">
						{focus.linkedTo === 'no'
							? 'Axe de travail non rattaché à un contrat'
							: contractTypeFullKeys.byKey[focus.linkedTo]}
					</p>
				{/if}
				<Button
					outline={true}
					on:click={() =>
						openComponent.open({ component: ProNotebookFocusUpdate, props: { focus } })}
					>Mettre à jour</Button
				>
			</div>
		</div>
		<div class="flex flex-col gap-4">
			<h2 class="fr-h4 bf-500">Situation</h2>
			<ul class="dsfr-list px-9 py-6 bg-gray-100 flex flex-row flex-wrap flex-grow">
				{#each situations as situation, i (i)}
					<li class="w-1/2 font-bold dsfr-bullet">
						{situation}
					</li>
				{/each}
			</ul>
		</div>
		<div class="flex flex-col gap-4">
			<h2 class="fr-h4 bf-500">Objectifs</h2>
			<div>
				<Accordions>
					{#each targets as target (target.id)}
						<Accordion title={target.target}>
							<ProNotebookActionList {target} />
						</Accordion>
					{:else}
						<p>Aucun objectif n'a été créé pour cet axe de travail.</p>
					{/each}
				</Accordions>
			</div>
			<div>
				<Button on:click={createTarget}>Ajouter un objectif</Button>
			</div>
		</div>
		<div class="flex flex-row gap-4">
			<div class="w-1/2 items-stretch">
				<h2 class="fr-h4 bf-500">Créé par</h2>
				<Card onClick={viewCreator}>
					<span slot="title">
						{focus?.professional ? displayFullName(focus?.professional) : ''}
					</span>
					<span slot="description">
						<Text value={focus?.professional?.position} />
						<Text classNames="font-bold" value={focus?.professional?.mobileNumber} />
					</span>
				</Card>
			</div>
			<div class="w-1/2 ml-1 items-stretch flex flex-col">
				<h2 class="fr-h4 bf-500">Structures sollicitées</h2>
				{#if structures.length > 0}
					<div class="flex flex-1">
						<Card onClick={viewStructures}>
							<span slot="title">{''}</span>
							<span slot="description">
								<span class="font-bold">
									{`Voir toutes les structures (${structures.length})`}
								</span>
							</span>
						</Card>
					</div>
				{:else}
					<div class="flex flex-1">
						<Card hideArrow>
							<span slot="description">
								<span class="font-bold"> Aucune structure sollicitées </span>
							</span>
						</Card>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}
	.dsfr-bullet {
		list-style-type: '\2022 ';
		padding-left: 0.4rem;
	}
	.dsfr-bullet::marker {
		color: var(--bf500);
	}
</style>
