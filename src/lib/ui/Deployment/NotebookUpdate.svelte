<script context="module" lang="ts">
	import { GetDeploymentNotebooksDocument } from '$lib/graphql/_gen/typed-document-nodes';

	import { operationStore, query } from '@urql/svelte';
</script>

<script lang="ts">
	import { LoaderIndicator } from '$lib/ui/utils';
	import NotebookListUpdater from './NotebookListUpdater.svelte';

	export let deploymentId: string;
	const getDeploymentStore = operationStore(GetDeploymentNotebooksDocument, { deploymentId });
	query(getDeploymentStore);

	$: notebooks = $getDeploymentStore.data?.notebooks;
</script>

<LoaderIndicator result={getDeploymentStore}>
	<NotebookListUpdater {notebooks} />
</LoaderIndicator>
