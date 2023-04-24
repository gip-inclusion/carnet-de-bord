<script lang="ts">
	import { Elm as NPSRatingElm } from '../../../../elm/NPSRating/Main.elm';
	import ElmWrapper from '$lib/utils/ElmWrapper.svelte';

	const elmSetup = (node: HTMLElement) => {
		NPSRatingElm.NPSRating.Main.init({ node });
	};
</script>

<ElmWrapper setup={elmSetup} />
