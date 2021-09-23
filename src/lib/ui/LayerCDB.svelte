<script lang="ts">
	import type { OpenComponentStore } from '$lib/stores';
	export let openComponent: OpenComponentStore = null;
	import { fade, fly } from 'svelte/transition';
	function handleKeyDown(event: KeyboardEvent) {
		if ($openComponent) {
			if (event.key === 'Escape') {
				close();
			}
		}
	}

	$: close = $openComponent?.onClose || openComponent.close;
</script>

<svelte:window on:keydown={handleKeyDown} />
{#if $openComponent}
	<div transition:fade on:click={close} class="!m-0 z-10 fixed inset-0">
		<div class="absolute inset-0 bg-black opacity-50" tabindex="0" />
	</div>
{/if}

{#if $openComponent}
	<div
		transition:fly={{ duration: 300, x: 300 }}
		class="flex !m-0 top-0 right-0 w-1/2 bg-white fixed h-full overflow-y-scroll layer overscroll-contain"
	>
		<div class="flex flex-col w-full gap-6 mx-14 mt-28">
			<svelte:component
				this={$openComponent.component}
				{...$openComponent.props}
				componentOnClose={$openComponent?.onClose}
			/>
		</div>
		<button
			on:click={close}
			type="button"
			class="bt text-2xl  text-france-blue absolute top-14 right-14"
		>
			<span class="ri-close-line" aria-label="fermer le panneau" />
		</button>
	</div>
{/if}

<style>
	.layer {
		z-index: 3501;
	}
</style>
