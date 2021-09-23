<script lang="ts">
	import type { OpenComponentStore } from '$lib/stores';
	export let openComponent: OpenComponentStore = null;

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
	<div on:click={close} class="!m-0 z-10 fixed inset-0 transition-opacity">
		<div class="absolute inset-0 bg-black opacity-50" tabindex="0" />
	</div>

	<div
		class="!m-0 transform top-0 right-0 w-8/12 bg-white flex fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 overscroll-contain {openComponent
			? 'translate-x-0'
			: 'translate-x-full'}"
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
