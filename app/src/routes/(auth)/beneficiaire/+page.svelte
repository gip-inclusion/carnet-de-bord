<script lang="ts">
	import NotebookView from '$lib/ui/views/NotebookView.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { GetNotebookByBeneficiaryIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import type { PageData } from './$types';
	//import { Elm } from '../../../../elm/BeneficiaryApp/Main.elm';
	//import { onMount } from 'svelte';

	export let data: PageData;

	const getNotebookResult = operationStore(GetNotebookByBeneficiaryIdDocument, {
		id: data.user.beneficiaryId,
	});
	query(getNotebookResult);

	//let node;
	//onMount(() => {
	//	let app = Elm.BeneficiaryApp.Main.init({
	//		node,
	//		flags: {
	//			beneficiaryId: $connectedUser.beneficiaryId,
	//		},
	//	});
	//	app.ports.sendMessage.subscribe((message) => {
	//		app.ports.messageReceiver.send('Msg from Svelte' + message);
	//	});
	//});
</script>

<svelte:head>
	<title>Accueil Bénéficiaire - Carnet de bord</title>
</svelte:head>

<!--<div bind:this={node} />-->

<LoaderIndicator result={getNotebookResult}>
	<NotebookView notebook={getNotebookResult.data.notebook[0]} />
</LoaderIndicator>
