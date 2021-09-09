<script lang="ts">
	import type { OpenComponentStore } from '$lib/stores';
	export let openComponent: OpenComponentStore = null;

	const close = () => {
		openComponent.close();
	};
</script>

{#if $openComponent}
	<div on:click={close} class="!m-0 z-10 fixed inset-0 transition-opacity">
		<div class="absolute inset-0 bg-black opacity-50" tabindex="0" />
	</div>

	<div
		class="!m-0 transform top-0 right-0 w-1/2 bg-white flex fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 overscroll-contain {openComponent
			? 'translate-x-0'
			: 'translate-x-full'}"
	>
		<svelte:component this={$openComponent.component} {...$openComponent.props} />
	</div>
{/if}
