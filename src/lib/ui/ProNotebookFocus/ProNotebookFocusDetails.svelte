<script lang="ts">
	import { contractTypeFullKeys, focusThemeKeys } from '$lib/constants/keys';
	import {
		DeleteNotebookFocusByIdDocument,
		GetNotebookFocusByIdDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { trackEvent } from '$lib/tracking/matomo';
	import { Accordion, Accordions, Button, Card } from '$lib/ui/base';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { displayFullName } from '$lib/ui/format';
	import { Text } from '$lib/ui/utils';
	import { mutation, operationStore, query } from '@urql/svelte';
	import { ProNotebookActionList } from '../ProNotebookAction';
	import ProNotebookCreatorView from '../ProNotebookCreator/ProNotebookCreatorView.svelte';
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
	const deleteFocusStore = operationStore(DeleteNotebookFocusByIdDocument);
	const deleteFocusMutation = mutation(deleteFocusStore);

	$: focus = $focusStore.data?.focus;
	// TODO(augustin): check that situations indeed parse as a string[] from jsonb
	$: situations = (focus?.situations as string[]) || [];
	$: targets = focus?.targets || [];

	function createTarget() {
		openComponent.open({
			component: ProNotebookTargetCreate,
			props: { focusId: focus?.id, focusTheme: focus?.theme },
		});
	}

	function viewCreator() {
		openComponent.open({
			component: ProNotebookCreatorView,
			props: { creator: focus?.professional, createdAt: focus?.createdAt },
		});
	}

	async function removeFocus() {
		trackEvent('pro', 'notebook', `remove focus`);
		await deleteFocusMutation({ id: focus.id });
		openComponent.close();
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
			<h2 class="fr-h4 text-france-blue">Situation actuelle</h2>
			<ul class="dsfr-list px-9 py-6 bg-gray-100 flex flex-row flex-wrap flex-grow">
				{#each situations as situation, i (i)}
					<li class="w-1/2 font-bold dsfr-bullet">
						{situation}
					</li>
				{/each}
			</ul>
		</div>
		<div class="flex flex-col gap-4">
			<h2 class="fr-h4 text-france-blue">Objectifs</h2>
			<div>
				<Accordions>
					{#each targets as target (target.id)}
						<Accordion title={target.target}>
							<ProNotebookActionList {target} theme={focus.theme} />
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
				<h2 class="fr-h4 text-france-blue">Créé par</h2>
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
		</div>
		<div class="flex">
			<Dialog
				title="Supprimer un axe de travail"
				label="Supprimer l'axe de travail"
				on:confirm={removeFocus}
			>
				<p>
					Êtes-vous sûr(e) de vouloir supprimer l’axe de travail
					<strong>{focus.theme}</strong>&nbsp;?
				</p>
			</Dialog>
		</div>
	</div>
{/if}

<style lang="postcss">
	.dsfr-bullet {
		list-style-type: '\2022 ';
		padding-left: 0.4rem;
	}
	.dsfr-bullet::marker {
		color: var(--bf500);
	}
</style>
