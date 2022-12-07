<script lang="ts">
	import type { PageData } from './$types';
	import { graphqlAPI, token } from '$lib/stores';

	export let data: PageData;

	import { ElmRo as Elm } from '../../../../../../../elm/ReadOnlyNotebook/Main.elm';
	import { onMount } from 'svelte';

	let elmNode: HTMLElement;
	onMount(() => {
		if (!elmNode) return;
		Elm.ReadOnlyNotebook.Main.init({
			node: elmNode,
			flags: {
				token: $token,
				serverUrl: $graphqlAPI,
				notebookId: data.notebookId,
			},
		});
	});
</script>

<svelte:head>
	<title>Informations du bénéficiaire - Carnet de bord</title>
</svelte:head>

<div>
	<!-- Elm app needs to be wrapped by a div to avoid navigation exceptions when unmounting -->
	<div bind:this={elmNode} />
</div>
