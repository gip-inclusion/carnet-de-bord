<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { DialogOverlay, DialogContent } from 'svelte-accessible-dialog';
	import { Button } from '$lib/ui/base';

	export let label: string;
	export let showButtons = true;
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let buttonLabel: string = label;
	export let confirmLabel: string = label;
	export let outlineButton = true;
	export let title: string;
	export let buttonCssClasses = '';

	let medCol = '';
	let lgCol = '';

	switch (size) {
		case 'small':
			medCol = '6';
			lgCol = '4';
			break;
		case 'large':
			medCol = '10';
			lgCol = '10';
			break;
		case 'medium':
		default:
			medCol = '8';
			lgCol = '6';
	}

	let isOpen = false;

	const dispatch = createEventDispatcher();

	const open = () => {
		isOpen = true;
		dispatch('open');
	};

	const close = () => {
		isOpen = false;
		dispatch('close');
	};

	const confirm = () => {
		close();
		dispatch('confirm');
	};
</script>

<Button
	outline={outlineButton}
	on:click={open}
	classNames="flex-1 justify-center {buttonCssClasses}"
>
	{#if $$slots.buttonLabel}
		<slot name="buttonLabel" />
	{:else}
		{buttonLabel}
	{/if}
</Button>
<DialogOverlay {isOpen} onDismiss={close}>
	<DialogContent aria-label={title}>
		<div class="fr-container fr-container--fluid fr-container-md">
			<div class="fr-grid-row fr-grid-row--center">
				<div class="fr-col-12 fr-col-md-{medCol} fr-col-lg-{lgCol}">
					<div class="fr-modal__body">
						<div class="fr-modal__header">
							<button
								on:click={close}
								class="fr-link--close fr-link"
								title="Fermer la fenêtre modale"
								aria-controls="fr-modal-1">Fermer</button
							>
						</div>
						<div class="fr-modal__content">
							<h1 id="fr-modal-title-modal-1" class="fr-modal__title">
								<span class="fr-icon-arrow-right-line fr-fi--lg" />{title}
							</h1>
							<slot />
							{#if showButtons}
								<div class="flex mt-4 gap-6">
									<Button on:click={confirm}>
										{confirmLabel}
									</Button>
									<Button outline on:click={close}>Annuler</Button>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</DialogContent>
</DialogOverlay>

<style>
	:global([data-svelte-dialog-overlay]) {
		z-index: 200;
	}

	:global([data-svelte-dialog-content]) {
		padding: 0 !important;
		background-color: transparent !important;
		width: 100% !important;
	}

	:global(.mw-200px) {
		max-width: 200px;
	}
</style>
