<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { backendAPI, token, graphqlAPI } from '$lib/stores';
	import { Elm as NPSRatingElm } from '../../../../elm/NPSRating/Main.elm';

	let elmNode: HTMLElement;
	afterUpdate(() => {
		NPSRatingElm.NPSRating.Main.init({
			node: elmNode,
			flags: {
				backendAPI: $backendAPI,
				token: $token,
				serverUrl: $graphqlAPI,
			},
		});
	});
</script>

<div bind:this={elmNode} />
