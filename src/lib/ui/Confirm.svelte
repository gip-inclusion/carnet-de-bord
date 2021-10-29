<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { DialogOverlay, DialogContent } from 'svelte-accessible-dialog';
	import Button from './base/Button.svelte';

	export let label: string;
	export let title: string;

	let isOpen = false;

	const dispatch = createEventDispatcher();

	const open = () => {
		isOpen = true;
	};

	const close = () => {
		isOpen = false;
	};

	const confirm = () => {
		close();
		dispatch('confirm');
	};
</script>

<Button outline on:click={open}>{label}</Button>
<DialogOverlay {isOpen} onDismiss={close} on:keypress={(e) => console.log(e)}>
	<DialogContent aria-label={title}>
		<div class="fr-container fr-container--fluid fr-container-md">
			<div class="fr-grid-row fr-grid-row--center">
				<div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
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
								<span class="fr-fi-arrow-right-line fr-fi--lg" />{title}
							</h1>
							<slot />
							<div class="flex gap-6">
								<Button on:click={confirm}>{label}</Button>
								<Button outline on:click={close}>Annuler</Button>
							</div>
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
</style>
