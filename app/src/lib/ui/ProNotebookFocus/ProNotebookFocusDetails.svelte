<script lang="ts">
	import { contractTypeFullKeys, focusThemeKeys } from '$lib/constants/keys';
	import {
		DeleteNotebookFocusByIdDocument,
		GetNotebookFocusByIdDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';

	import { UpdateTargetStatusActionDocument } from '$lib/graphql/_gen/typed-document-nodes';

	import type {
		GetNotebookFocusByIdQuery,
		UpdateTargetStatusActionMutation,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { trackEvent } from '$lib/tracking/matomo';
	import { Accordion, Accordions, Button, Card, Select } from '$lib/ui/base';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { displayFullName } from '$lib/ui/format';
	import { Text } from '$lib/ui/utils';
	import { type OperationStore, mutation, operationStore, query } from '@urql/svelte';
	import { ProNotebookActionList } from '../ProNotebookAction';
	import ProNotebookCreatorView from '../ProNotebookCreator/ProNotebookCreatorView.svelte';
	import ProNotebookTargetCreate from '../ProNotebookTarget';
	import { targetStatusValues } from '$lib/constants';
	import { LoaderIndicator } from '$lib/ui/utils';
	import Alert from '$lib/ui/base/Alert.svelte';

	type Target = GetNotebookFocusByIdQuery['focus']['targets'][number];

	export let focusId: string;

	const focusStore = operationStore(
		GetNotebookFocusByIdDocument,
		{ id: focusId },
		{
			additionalTypenames: ['notebook_target'],
		}
	);
	query(focusStore);

	const deleteFocusMutation = mutation(
		operationStore(DeleteNotebookFocusByIdDocument, null, {
			additionalTypenames: ['notebook_focus'],
		})
	);

	$: focus = $focusStore.data?.focus;
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
			props: {
				creator: focus?.creator,
				createdAt: focus?.createdAt,
			},
		});
	}

	const updateNotebookTargetStatus = mutation(
		operationStore(UpdateTargetStatusActionDocument, null, {
			additionalTypenames: ['notebook_target', 'notebook_event'],
		})
	);
	let updateResult: OperationStore<UpdateTargetStatusActionMutation>;

	let error: string;

	async function onChangeTarget(
		event: CustomEvent<{ selected: string; name: string }>,
		target: Target
	) {
		target[event.detail.name] = event.detail.selected;

		updateResult = await updateNotebookTargetStatus({
			id: target.id,
			status: target.status,
			linkedTo: target.linkedTo,
		});

		if (updateResult.error) {
			error = "Erreur lors de la mise à jour de l'objectif.";
		}
	}

	async function removeFocus() {
		trackEvent('pro', 'notebook', `remove focus`);
		await deleteFocusMutation({ id: focus.id });
		openComponent.close();
	}
</script>

<LoaderIndicator result={focusStore}>
	<div class="flex flex-col gap-6">
		<div>
			<h1 class="mb-0">{focusThemeKeys.byKey[focus?.theme]}</h1>
		</div>
		<div class="flex flex-col gap-4">
			<h2 class="fr-h4 text-vert-cdb">Objectifs</h2>
			<div>
				<Accordions>
					{#each targets as target (target.id)}
						<Accordion
							title={'<span>' +
								target.target +
								' - <em>' +
								targetStatusValues.find((value) => value.name == target.status)?.label +
								'</em></span>'}
						>
							<div class="flex justify-between gap-8">
								<Select
									name="linkedTo"
									selectLabel={'Objectif lié à un contrat'}
									options={contractTypeFullKeys.options}
									selected={target.linkedTo}
									classNames="shrink"
									on:select={(event) => onChangeTarget(event, target)}
								/>
								<Select
									name="status"
									selectLabel={"Statut global de l'objectif"}
									options={targetStatusValues}
									selected={target.status}
									classNames="shrink-0"
									on:select={(event) => onChangeTarget(event, target)}
								/>
							</div>
							{#if error}
								<Alert type="error" title={error} size="sm" />
							{/if}
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
				{#if focus?.creator?.professional || focus?.creator?.orientation_manager}
					<h2 class="fr-h4 text-vert-cdb">Créé par</h2>
					<Card onClick={viewCreator}>
						<span slot="title">
							{displayFullName(focus?.creator?.professional || focus?.creator?.orientation_manager)}
						</span>
						<span slot="description">
							<Text
								value={focus?.creator?.professional
									? focus?.creator?.professional.position
									: "Chargé d'orientation"}
							/>
							{#if focus.creator.professional}
								<Text class="font-bold" value={focus.creator.professional.mobileNumber} />
							{/if}
							{#if focus.creator.orientation_manager}
								<Text class="font-bold" value={focus.creator.orientation_manager.phoneNumbers} />
							{/if}
						</span>
					</Card>
				{/if}
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
</LoaderIndicator>
