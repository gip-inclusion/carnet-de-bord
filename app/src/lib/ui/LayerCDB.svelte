<script lang="ts">
	import IconButton from '$lib/ui/base/IconButton.svelte';
	import { openComponent } from '$lib/stores';
	import { fade, fly } from 'svelte/transition';
	function handleKeyDown(event: KeyboardEvent) {
		if ($openComponent) {
			if (event.key === 'Escape') {
				close();
			}
		}
	}
	function close() {
		openComponent.close();
	}
	$: currentLayer = $openComponent.slice(-1)[0];
</script>

<svelte:window on:keydown={handleKeyDown} />
{#if currentLayer}
	<div transition:fade on:click={close} on:keydown={handleKeyDown} class="!m-0 fixed inset-0 layer">
		<div class="absolute inset-0 bg-black opacity-50" />
	</div>
{/if}

{#if currentLayer}
	<div
		transition:fly={{ duration: 300, x: 300 }}
		class="!m-0 top-0 right-0 w-1/2 bg-white fixed h-full overflow-y-scroll overscroll-contain layer"
	>
		<div class="flex flex-col gap-6 mx-14 mt-28 mb-14" role="dialog" tabindex="-1">
			<svelte:component this={currentLayer.component} {...currentLayer.props} />
		</div>

		<IconButton
			on:click={close}
			icon="fr-icon-close-line"
			title="fermer le panneau"
			class="absolute top-4 right-4 fr-btn--tertiary-no-outline"
		/>
	</div>
{/if}

<style>
	.layer {
		z-index: 500;
	}
</style>
