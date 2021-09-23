<script context="module" type="ts">
	let counter = 0;
	// the object menu act as a key for the MenuButton context
</script>

<script type="ts">
	import { setContext, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { MENU } from './menu';
	export let ref = null;
	export let icon = 'fr-fi-account-line';
	let menuId = `menu-${counter++}`;
	let buttonId = `button-${menuId}`;
	let isOpened = false;

	let selectedItem = writable(null);
	let focusedItem = writable(null);

	let menuitems = [];
	setContext(MENU, {
		registerMenuItem: (menuItem) => {
			menuitems.push(menuItem);

			onDestroy(() => {
				menuitems = menuitems.flatMap((item) => {
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
				let itemIndex = menuitems.indexOf($focusedItem) + 1;
				if (itemIndex === menuitems.length) {
					itemIndex = 0;
				}
				focusedItem.set(menuitems[itemIndex]);
				break;
			}
			case 'ArrowUp': {
				e.preventDefault();
				let itemIndex = menuitems.indexOf($focusedItem) - 1;
				if (itemIndex < 0) {
					itemIndex = menuitems.length - 1;
				}
				focusedItem.set(menuitems[itemIndex]);
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
	<span class={icon} aria-label="Mon compte" />
</button>
<div
	class:block={isOpened}
	class:hidden={!isOpened}
	class="relative"
	hidden={!isOpened}
	aria-hidden={!isOpened}
>
	<div
		class="absolute flex flex-col right-0 shadow-xl"
		aria-labelledby={buttonId}
		tabindex="-1"
		role="menu"
		id={menuId}
		aria-activedescendant=""
	>
		<slot />
	</div>
</div>
