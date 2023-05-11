<script lang="ts">
	import { backendAPI, token, graphqlAPI } from '$lib/stores';
	import { captureException } from '$lib/utils/sentry';
	import { Elm as NPSRatingElm } from '../../../../elm/NPSRating/Main.elm';
	import ElmWrapper from '$lib/utils/ElmWrapper.svelte';

	const elmSetup = (node: HTMLElement) => {
		const app = NPSRatingElm.NPSRating.Main.init({
			node,
			flags: {
				backendAPI: $backendAPI,
				token: $token,
				serverUrl: $graphqlAPI,
			},
		});

		app.ports.sendError.subscribe((message: string) => {
			setTimeout(() => captureException(new Error(message)), 10);
		});
	};
</script>

<ElmWrapper setup={elmSetup} />
