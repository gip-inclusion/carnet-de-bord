<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { backendAPI, token, graphqlAPI } from '$lib/stores';
	import { captureException } from '$lib/utils/sentry';
	import { Elm as NPSRatingElm } from '../../../../elm/NPSRating/Main.elm';

	let elmNode: HTMLElement;
	afterUpdate(async () => {
		const app = NPSRatingElm.NPSRating.Main.init({
			node: elmNode,
			flags: {
				backendAPI: $backendAPI,
				token: $token,
				serverUrl: $graphqlAPI,
			},
		});

		app.ports.sendError.subscribe((message: string) => {
			setTimeout(() => captureException(new Error(message)), 10);
		});
	});
</script>

<div bind:this={elmNode} />
