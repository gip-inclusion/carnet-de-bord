<script lang="ts">
	import { contractTypeKeys, focusThemeKeys } from '$lib/constants/keys';
	import type { NotebookFocus } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { Button, Card } from '../base';
	import { Text } from '../utils';
	import ProNotebookFocusCreate from './ProNotebookFocusCreate.svelte';

	export let notebookId: string;
	export let focuses: Pick<NotebookFocus, 'id' | 'theme' | 'situations' | 'linkedTo'>[] = [];

	const addFocus = () => {
		openComponent.open({ component: ProNotebookFocusCreate, props: { notebookId } });
	};
</script>

<div class="flex flex-row flex-wrap gap-4">
	{#each focuses as focus (focus.id)}
		<div class="w-5/12 box-border">
			<Card hideArrow={false}>
				<span slot="title">{focusThemeKeys.byKey[focus.theme]}</span>
				<span slot="description">
					<Text value={contractTypeKeys.byKey[focus.linkedTo]} />
				</span>
			</Card>
		</div>
	{/each}
	<div><Button on:click={addFocus}>Ajouter un axe de travail</Button></div>
</div>
