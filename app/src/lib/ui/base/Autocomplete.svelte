<script context="module" lang="ts">
	let counter = 0;
	export type AutoCompleteOption = {
		label: string;
		value: string;
	};
	type Suggestion = AutoCompleteOption & { selected: boolean; index: number; ref: HTMLDivElement };
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	counter++;
	const uniqueId = `select-input-${counter}`;
	export let id = uniqueId;

	export let label = 'Sélectionner un élément';
	export let help =
		'Utilisez la tabulation (ou les touches flèches) pour naviguer dans la liste des suggestions';
	export let placeholder = 'Sélectionner un élément';
	export let searchPlaceholder = 'Rechercher dans la liste';
	export let noResultLabel = 'Aucun résultat';
	export let resultLabel = '{x} suggestion(s) disponibles';

	export let deleteItemLabel = 'Supprimer {x}';

	export let multiple = false;
	export let search = '';
	export let options: AutoCompleteOption[] = [];
	export let selectedItems: AutoCompleteOption[] = [];
	export let selectedItem: AutoCompleteOption = null;

	let open = false;
	let suggestions: Suggestion[];

	let focusIndex: number = null;

	let livezoneText = '';
	let input: HTMLInputElement = null;
	let button: HTMLButtonElement = null;
	let overlay: HTMLDivElement = null;

	let timeout = null;

	const dispatch = createEventDispatcher();

	$: internalOptions = options.map((o, i): Suggestion => {
		const selected = !multiple
			? o.value === selectedItem?.value
			: selectedItems?.findIndex((item) => item.value === o.value) !== -1;

		return { ...o, index: i, ref: null, selected };
	});

	function buttonClickHandler() {
		toggleOverlay();
	}

	function toggleOverlay(state = undefined, focusBack = false) {
		open = state !== undefined ? state : !open;
		if (open) {
			filterSuggestions();
			setTimeout(() => {
				input && input.focus();
			});
		} else {
			focusIndex = null;
			search = '';
			updateLiveZone();
			if (state === undefined || focusBack) {
				setTimeout(() => button.focus());
			}
		}
	}

	function filterSuggestions() {
		suggestions = internalOptions.filter((option) => {
			const text = option.label || option.value.toString();
			return text.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1;
		});
		updateLiveZone();
	}

	function updateLiveZone() {
		if (open) {
			const nbSuggestions = suggestions.length;
			if (nbSuggestions > 0) {
				livezoneText = resultLabel.replace('{x}', nbSuggestions.toString());
			} else {
				livezoneText = noResultLabel;
			}
		} else {
			livezoneText = '';
		}
	}

	function inputEventHandler() {
		filterSuggestions();
	}

	function positionCursor() {
		setTimeout(() => {
			input.selectionStart = input.selectionEnd = input.value.length;
		});
	}

	function suggestionClickHandler(event: MouseEvent, suggestionIndex: number) {
		const shouldClose = multiple && event.metaKey ? false : true;
		toggleSelection(suggestionIndex, shouldClose);
	}

	function toggleSelection(suggestionIndex: number, close = true) {
		if (multiple) {
			selectedItems = internalOptions.flatMap((o) => {
				const { value, label } = o;
				if (o.index === suggestionIndex) {
					if (o.selected) {
						return [];
					}
					return { label, value };
				}
				return o.selected ? { label, value } : [];
			});
		} else {
			const { label, value } = internalOptions.find((o) => o.index === suggestionIndex);
			selectedItem = { label, value };
		}
		if (close && open) {
			toggleOverlay();
		}
		dispatch('change', { ...(multiple ? { selectedItems } : { selectedItem }) });
	}

	function keydownHandler(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			toggleOverlay();
			return;
		}
		if (event.key === 'Enter' && event.target === input) {
			event.preventDefault();
			return;
		}
		if (event.key === 'ArrowDown') {
			moveIndex(1);
			event.preventDefault();
		}

		const target = event.target as HTMLDivElement;
		if (target.getAttribute('role') !== 'option') {
			return;
		}
		if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			moveIndex(-1);
			event.preventDefault();
			return;
		}
		if (event.key === 'ArrowRight') {
			moveIndex(1);
			event.preventDefault();
			return;
		}
		if ((!multiple && event.key === 'Enter') || event.key === 'Space') {
			event.preventDefault();
			toggleSelection(suggestions[focusIndex].index, multiple ? false : true);
		}

		if (multiple && event.key === 'Enter') {
			toggleOverlay();
		}
	}

	function moveIndex(step: number) {
		if (focusIndex === null) {
			focusIndex = 0;
		} else {
			const nextIndex = focusIndex + step;
			const selectionItems = suggestions.length - 1;

			if (nextIndex > selectionItems) {
				focusIndex = 0;
			} else if (nextIndex < 0) {
				focusIndex = selectionItems;
			} else {
				focusIndex = nextIndex;
			}
		}
		suggestions[focusIndex].ref.focus();
	}
	function blurHandler() {
		if (!open) {
			return;
		}
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (!overlay.contains(document.activeElement) && button !== document.activeElement) {
				toggleOverlay(false, document.activeElement === document.body);
			} else if (document.activeElement === input) {
				focusIndex = null;
			} else {
				const optionIndex = suggestions.findIndex(({ ref }) => ref === document.activeElement);
				if (optionIndex !== -1) {
					focusIndex = optionIndex;
				}
			}
		}, 10);
	}
</script>

<svelte:window on:blur|capture={blurHandler} />

<div>
	<label class="fr-label" id={`${id}-label`} for={`${id}-input`}>{label}</label>
	<div class="relative" on:keydown={keydownHandler}>
		<p class="sr-only" aria-live="polite">{livezoneText}</p>
		<button
			bind:this={button}
			on:click={buttonClickHandler}
			id={`${id}-button`}
			class="fr-select text-left"
			aria-expanded={open}
			aria-labelledby={`${id}-label ${id}-button`}
		>
			<span>
				{#if !multiple && selectedItem}
					{selectedItem.label}
				{:else}
					{placeholder}
				{/if}
			</span>
		</button>
		{#if open}
			<div class="absolute left-0 right-0 p-2 bg z-10" bind:this={overlay}>
				<div class="p-1" id={`${id}-suggestions`}>
					<p id={`${id}-usage`} class="sr-only">{help}</p>
					<label for={`${id}-input`} class="sr-only">{searchPlaceholder}</label>
					<input
						id={`${id}-input`}
						type="search"
						bind:value={search}
						on:input={inputEventHandler}
						on:focus={positionCursor}
						bind:this={input}
						class="fr-input"
						role="search"
						autocomplete="off"
						autocapitalize="off"
						spellcheck="false"
						aria-describedby={`${id}-usage`}
						placeholder={searchPlaceholder}
					/>
					{#if suggestions.length === 0}
						<p>{noResultLabel}</p>
					{:else}
						<div
							role="listbox"
							class="m-2 max-h-60 overflow-y-auto p-1"
							aria-multiselectable={multiple}
							tabindex="0"
						>
							{#each suggestions as suggestion}
								<div
									on:click={(e) => suggestionClickHandler(e, suggestion.index)}
									role="option"
									tabindex="0"
									class="option"
									aria-selected={suggestion.selected}
									bind:this={suggestion.ref}
								>
									<span class="block p-1">
										{suggestion.label}
									</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/if}
		{#if multiple}
			{#each internalOptions.filter((o) => o.selected) as item}
				<button
					class="fr-tag fr-tag--sm fr-tag--dismiss"
					aria-label={deleteItemLabel.replace('{x}', item.label)}
					on:click={() => toggleSelection(item.index)}>{item.label}</button
				>
			{/each}
		{/if}
	</div>
</div>

<style>
	.bg {
		background-color: var(--background-contrast-grey);
	}

	.option {
		cursor: pointer;
		color: var(--text-title-grey-100);
		background-color: var(--background-contrast-grey);
	}
	.option:focus,
	.option:hover {
		background-color: var(--background-elevated-grey);
		color: var(--text-alt-grey);
	}
	.option[aria-selected='true'] {
		font-weight: 700;
		background-color: var(--background-elevated-grey);
	}
</style>
