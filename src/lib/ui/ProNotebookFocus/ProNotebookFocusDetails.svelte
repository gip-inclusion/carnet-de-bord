<script lang="ts">
	import { contractTypeFullKeys, focusThemeKeys } from '$lib/constants/keys';
	import { GetNotebookFocusByIdDocument, Structure } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { Accordion, Accordions, Button, Card } from '$lib/ui/base';
	import { displayFullName } from '$lib/ui/format';
	import { Text } from '$lib/ui/utils';
	import { operationStore, query } from '@urql/svelte';
	import { ProNotebookActionList } from '../ProNotebookAction';
	import ProNotebookTargetCreate from '../ProNotebookTarget/ProNotebookTargetCreate.svelte';
	import ProNotebookFocusUpdate from './ProNotebookFocusUpdate.svelte';

	export let focusId: string;

	const focusStore = operationStore(GetNotebookFocusByIdDocument, { id: focusId });
	query(focusStore);

	const init: Record<string, Pick<Structure, 'id' | 'name'>> = {};

	$: focus = $focusStore.data?.focus;
	$: situations = (focus?.situations as string[]) || [];
	$: targets = focus?.targets;

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
</script>

{#if focus}
	<div class="flex flex-col gap-6 mb-6">
		<div class="flex flex-row">
			<div class="flex-grow">
				<h1>{focusThemeKeys.byKey[focus?.theme]}</h1>
				{#if focus?.linkedTo}
					<p class="mb-0">{contractTypeFullKeys.byKey[focus?.linkedTo]}</p>
				{/if}
			</div>
			<div class="float-right mr-6">
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
			<Card>
				<span slot="description">
					<div class="flex flex-row flex-wrap flex-grow">
						{#each situations as situation, i (i)}
							<span class="w-1/2 font-bold">
								<span class="bf-500 fr-text--lg">·</span>{' '}{situation}
							</span>
						{/each}
					</div>
				</span>
			</Card>
		</div>
		<div class="flex flex-row gap-4">
			<div class="w-1/2">
				<h2 class="fr-h4 bf-500">Créé par</h2>
				<Card>
					<span slot="title">{focus?.professional ? displayFullName(focus?.professional) : ''}</span
					>
					<span slot="description">
						<Text value={focus?.professional?.position} />
					</span>
				</Card>
			</div>
			<div class="w-1/2 ml-1">
				<h2 class="fr-h4 bf-500">Structures sollicitées</h2>
				{#each structures as structure (structure.id)}
					<Card>
						<span slot="title">{'Objectif : '}{structure.id}</span>
					</Card>
				{:else}
					<Card>
						<span slot="title">{''}</span>
						<span slot="description">
							<span class="font-bold">
								{"Aucune structure n'a été sollicitée pour cet axe de travail."}
							</span>
						</span>
					</Card>
				{/each}
			</div>
		</div>
		<div class="flex flex-col gap-4">
			<h2 class="fr-h4 bf-500">Objectifs</h2>
			<div>
				<Accordions>
					{#each focus?.targets || [] as target (target.id)}
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
	</div>
{/if}

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}
</style>
