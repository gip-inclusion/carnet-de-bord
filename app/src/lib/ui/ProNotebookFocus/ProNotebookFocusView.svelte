<script lang="ts">
	import { contractTypeFullKeys, contractTypeKeys, focusThemeKeys } from '$lib/constants/keys';
	import type { NotebookFocus } from '$lib/graphql/_gen/typed-document-nodes';
	import { pluralize } from '$lib/helpers';
	import { openComponent } from '$lib/stores';
	import { Button, Card } from '$lib/ui/base';
	import ProNotebookContractDetails from '$lib/ui/ProNotebookContract/ProNotebookContractDetails.svelte';
	import { Text } from '$lib/ui/utils';
	import { dateInterval, formatDateLocale } from '$lib/utils/date';
	import ProNotebookFocusCreate from './ProNotebookFocusCreate.svelte';
	import ProNotebookFocusDetails from './ProNotebookFocusDetails.svelte';
	import type { GetNotebookQuery } from '$lib/graphql/_gen/typed-document-nodes';

	export let notebook: GetNotebookQuery['notebook_public_view'][0]['notebook'];
	export let focuses: (Pick<NotebookFocus, 'id' | 'theme' | 'linkedTo'> & {
		targets: { actions_aggregate: { aggregate?: { count: number } } }[];
	})[] = [];

	const addFocus = () => {
		openComponent.open({ component: ProNotebookFocusCreate, props: { notebookId: notebook.id } });
	};

	const showFocus = (focus: { id: string }) =>
		openComponent.open({ component: ProNotebookFocusDetails, props: { focusId: focus.id } });

	const openContract = () => {
		openComponent.open({ component: ProNotebookContractDetails, props: { notebook } });
	};

	function contractDatesTemplating(start: string, end: string) {
		if (start) {
			if (end) {
				return `Depuis le ${formatDateLocale(start)} jusqu'au ${formatDateLocale(end)}`;
			}
			return `Depuis le ${formatDateLocale(start)}`;
		}
		return '';
	}

	$: contractLabel =
		!notebook.contractType || 'no' === notebook.contractType
			? 'Rattacher un contrat au carnet de bord'
			: contractTypeFullKeys.byKey[notebook.contractType];

	/* eslint-disable */
	// See : https://stackoverflow.com/questions/68762690/svelte-disable-eslint-rule
	// Otherwise we have an error on the @nbActions definition below
</script>

<div class="flex flex-col gap-4">
	<div>
		<div
			class="text-vert-cdb underline cursor-pointer"
			on:keydown={openContract}
			on:click={openContract}
		>
			{contractLabel}
		</div>
		{#if notebook.contractSignDate}
			<div>
				{contractDatesTemplating(notebook.contractStartDate, notebook.contractEndDate)}
				-
				<span class="italic font-bold">
					({notebook.contractEndDate
						? dateInterval(notebook.contractStartDate, notebook.contractEndDate)
						: 'durée indéterminée'})
				</span>
			</div>
			<div>Signé le {formatDateLocale(notebook.contractSignDate)}</div>
		{/if}
	</div>
	<div class="flex flex-row flex-wrap">
		{#each focuses as focus, i (focus.id)}
			{@const nbActions = focus.targets.reduce(
				(total, { actions_aggregate: { aggregate } }) => (aggregate?.count ?? 0) + total,
				0
			)}
			<div class={`w-1/2 py-1 box-border cursor-pointer ${i % 2 ? 'pl-1' : 'pr-1'}`}>
				<Card hideArrow={false} onClick={() => showFocus(focus)}>
					<span slot="title">{focusThemeKeys.byKey[focus.theme]}</span>
					<span slot="description">
						<Text value={contractTypeKeys.byKey[focus.linkedTo]} />
						<Text
							value={nbActions > 0
								? `${nbActions} ${pluralize('action', nbActions)}`
								: 'Aucune action'}
							class="text-success font-bold"
						/>
					</span>
				</Card>
			</div>
		{/each}
	</div>
	<div><Button on:click={addFocus}>Ajouter un axe de travail</Button></div>
</div>
