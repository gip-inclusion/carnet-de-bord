<script context="module" lang="ts">
	let counter = 0;
	// the object menu act as a key for the MenuButton context
</script>

<script lang="ts">
	import { setContext, onDestroy } from 'svelte';
	import { type Writable, writable } from 'svelte/store';
	import { MENU } from './menu';
	export let ref = null;
	export let icon: string;
	export let label: string;
	let menuId = `menu-${counter++}`;
	let buttonId = `button-${menuId}`;
	let isOpened = false;

	let selectedItem: Writable<Record<never, never>> = writable(null);
	let focusedItem: Writable<Record<never, never>> = writable(null);

	let menuItems: Record<never, never>[] = [];
	setContext(MENU, {
		registerMenuItem: (menuItem: Record<never, never>) => {
			menuItems.push(menuItem);

			onDestroy(() => {
				menuItems = menuItems.flatMap((item) => {
					return menuItem === item ? [] : item;
				});
				focusedItem.update((item) => (item === menuItem ? null : item));
			});
		},
		focusedItem,
		selectedItem,
	});

	function select() {
		$selectedItem = $focusedItem;
		closeMenu();
	}
	function toggleMenu() {
		isOpened = !isOpened;
		if (!isOpened) {
			$focusedItem = null;
		}
	}
	function closeMenu() {
		isOpened = false;
		$focusedItem = null;
	}
</script>

<svelte:window
	on:click={({ target }) => {
		if (isOpened && ref && !ref.contains(target)) {
			closeMenu();
		}
	}}
/>
<button
	id={buttonId}
	bind:this={ref}
	on:click={toggleMenu}
	on:keydown
	on:blur
	on:keydown={(e) => {
		switch (e.key) {
			case 'Enter':
				e.preventDefault();
				select();
				break;
			case 'ArrowDown': {
				e.preventDefault();
				let itemIndex = menuItems.indexOf($focusedItem) + 1;
				if (itemIndex === menuItems.length) {
					itemIndex = 0;
				}
				focusedItem.set(menuItems[itemIndex]);
				break;
			}
			case 'ArrowUp': {
				e.preventDefault();
				let itemIndex = menuItems.indexOf($focusedItem) - 1;
				if (itemIndex < 0) {
					itemIndex = menuItems.length - 1;
				}
				focusedItem.set(menuItems[itemIndex]);
				break;
			}
			case 'Escape': {
				e.preventDefault();
				closeMenu();
				break;
			}
		}
	}}
	aria-expanded={isOpened}
	aria-haspopup="true"
	aria-controls={menuId}
	type="button"
	class="bt text-france-blue"
>
	<span class={icon} aria-label={label} />
</button>
<div
	class:block={isOpened}
	class:hidden={!isOpened}
	class="relative"
	hidden={!isOpened}
	aria-hidden={!isOpened}
>
	<div
		class="absolute flex flex-col right-0 shadow-xl bg-white"
		aria-labelledby={buttonId}
		tabindex="-1"
		role="menu"
		id={menuId}
		aria-activedescendant=""
	>
		<slot />
	</div>
</div>
