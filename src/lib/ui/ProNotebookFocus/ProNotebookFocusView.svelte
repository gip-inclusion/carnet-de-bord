<script lang="ts">
	import { contractTypeFullKeys, contractTypeKeys, focusThemeKeys } from '$lib/constants/keys';
	import type { Notebook, NotebookFocus } from '$lib/graphql/_gen/typed-document-nodes';
	import { pluralize } from '$lib/helpers';
	import { openComponent } from '$lib/stores';
	import { Button, Card } from '$lib/ui/base';
	import ProNotebookContractDetails from '$lib/ui/ProNotebookContract/ProNotebookContractDetails.svelte';
	import { Text } from '$lib/ui/utils';
	import { formatDateLocale } from '$lib/utils/date';
	import ProNotebookFocusCreate from './ProNotebookFocusCreate.svelte';
	import ProNotebookFocusDetails from './ProNotebookFocusDetails.svelte';

	export let notebook: Pick<Notebook, 'id' | 'contractType' | 'contractSignDate'>;
	export let focuses: (Pick<NotebookFocus, 'id' | 'theme' | 'situations' | 'linkedTo'> & {
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

	$: contractLabel =
		!notebook.contractType || 'no' === notebook.contractType
			? 'Rattacher un contrat au carnet de bord'
			: contractTypeFullKeys.byKey[notebook.contractType];
</script>

<div class="flex flex-col gap-4">
	<div>
		<div class="text-france-blue underline cursor-pointer" on:click={openContract}>
			{contractLabel}
		</div>
		{#if notebook.contractSignDate}
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
							value={`${nbActions} ${pluralize('action', nbActions)}`}
							classNames="text-success font-bold"
						/>
					</span>
				</Card>
			</div>
		{/each}
	</div>
	<div><Button on:click={addFocus}>Ajouter un axe de travail</Button></div>
</div>
