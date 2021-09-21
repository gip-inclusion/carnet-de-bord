<script lang="ts">
	import { contractTypeFullKeys, contractTypeKeys, focusThemeKeys } from '$lib/constants/keys';
	import type { Notebook, NotebookFocus } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { Button, Card } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import ProNotebookFocusCreate from './ProNotebookFocusCreate.svelte';
	import ProNotebookFocusDetails from './ProNotebookFocusDetails.svelte';
	import ProNotebookContractDetails from '$lib/ui/ProNotebookContract/ProNotebookContractDetails.svelte';

	export let notebook: Pick<Notebook, 'id' | 'contractType' | 'contractSignDate'>;
	export let focuses: Pick<NotebookFocus, 'id' | 'theme' | 'situations' | 'linkedTo'>[] = [];

	const addFocus = () => {
		openComponent.open({ component: ProNotebookFocusCreate, props: { notebookId: notebook.id } });
	};

	const showFocus = (focus: { id: string }) =>
		openComponent.open({ component: ProNotebookFocusDetails, props: { focusId: focus.id } });

	const openContract = () => {
		openComponent.open({ component: ProNotebookContractDetails, props: { notebook } });
	};
</script>

<div class="flex flex-col gap-4">
	<div>
		<div class="bf-500 underline cursor-pointer" on:click={openContract}>
			{contractTypeFullKeys.byKey[notebook.contractType] || 'Rattacher un contrat au carnet de bord'}
		</div>
		{#if notebook.contractSignDate}
			<div>Signé le {notebook.contractSignDate}</div>
		{/if}
	</div>
	<div class="flex flex-row flex-wrap">
		{#each focuses as focus, i (focus.id)}
			<div class={`w-1/2 py-1 box-border cursor-pointer ${i % 2 ? 'pl-1' : 'pr-1'}`}>
				<Card hideArrow={false} onClick={() => showFocus(focus)}>
					<span slot="title">{focusThemeKeys.byKey[focus.theme]}</span>
					<span slot="description">
						<Text value={contractTypeKeys.byKey[focus.linkedTo]} />
					</span>
				</Card>
			</div>
		{/each}
	</div>
	<div><Button on:click={addFocus}>Ajouter un axe de travail</Button></div>
</div>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}
</style>
