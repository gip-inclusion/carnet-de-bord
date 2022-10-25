<script lang="ts">
	import NotebookView from '$lib/ui/views/NotebookView.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { GetNotebookByBeneficiaryIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import type { PageData } from './$types';
	import { Elm } from '../../../elm/BeneficiaryApp/Main.elm';
	import { onMount } from 'svelte';

	export let data: PageData;

	const getNotebookResult = operationStore(GetNotebookByBeneficiaryIdDocument, {
		id: data.user.beneficiaryId,
	});
	query(getNotebookResult);

	let node;
	onMount(() => {
		let app = Elm.BeneficiaryApp.Main.init({
			node,
			flags: {
				token: $session.token,
				serverUrl: $session.graphqlAPI,
				beneficiaryId: $session.user.beneficiaryId,
			},
		});
		app.ports.sendMessage.subscribe(function (message) {
			console.log('Received from Elm: ' + message);
			app.ports.messageReceiver.send('Msg from Svelte');
		});
	});
</script>

<svelte:head>
	<title>Accueil Bénéficiaire - Carnet de bord</title>
</svelte:head>

<div bind:this={node} />

<LoaderIndicator result={getNotebookResult}>
	<NotebookView notebook={getNotebookResult.data.notebook[0]} />
</LoaderIndicator>
