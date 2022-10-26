import type { Writable } from 'svelte/store';

export const MENU = {};
export type MenuContext = {
	registerMenuItem: (menuItem: Record<never, never>) => void;
	focusedItem: Writable<Record<never, never>>;
	selectedItem: Writable<Record<never, never>>;
};
