<script lang="ts">
	import { afterUpdate } from 'svelte';

	export let setup: (node: HTMLElement) => void;
	let elmNode: HTMLElement;
	afterUpdate(() => {
		if (!elmNode || !elmNode.parentNode) return;
		setup(elmNode);
	});
</script>

<div class="elm-node">
	<!-- Elm app needs to be wrapped by a div to avoid navigation exceptions when unmounting -->
	<div bind:this={elmNode} />
</div>
