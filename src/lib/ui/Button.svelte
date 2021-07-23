<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	function click() {
		dispatch('click');
	}

	export let style: string | null = 'base';
	export let type: string = 'button';
	export let disabled: boolean = false;
</script>

<button on:click={click} type={type ? type : ''} {disabled} class={style}>
	<slot />
</button>

<style lang="postcss">
	.base {
		@apply w-32;
		@apply p-2;
		@apply px-4;

		@apply border-2;
		@apply border-opacity-20;
		@apply border-accent;
		@apply rounded;

		@apply bg-action;
		@apply hover:bg-accent;

		@apply disabled:bg-back2;

		@apply text-white;
		@apply hover:text-white;
	}

	.outline {
		@apply w-32;
		@apply p-2;
		@apply px-4;

		@apply border-2;
		@apply border-accent;
		@apply text-accent;
		@apply rounded;
		@apply hover:bg-accent;
		@apply hover:text-white;
	}
</style>
