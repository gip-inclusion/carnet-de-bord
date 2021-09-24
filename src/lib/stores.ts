import type { Account } from '$lib/types';
import { writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import type { SvelteComponent } from 'svelte';

export const account: Writable<null | Account> = writable(null);

export const offCanvas: Writable<boolean> = writable(false);
export const isMenuOpened: Writable<boolean> = writable(false);

type OpenComponentType = {
	component: typeof SvelteComponent;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	props?: Record<string, any>;
	onClose?: () => void;
} | null;

export type OpenComponentStore = Readable<OpenComponentType> & {
	get: () => OpenComponentType;
	close: () => void;
	open: (value: OpenComponentType) => void;
};

function createOpenComponent() {
	const openComponent: Writable<OpenComponentType> = writable(null);

	const { subscribe, set } = openComponent;
	let val;

	return {
		subscribe,
		get: () => val,
		close: () => {
			val = null;
			set(val);
			offCanvas.set(false);
		},
		open: (value) => {
			val = value;
			set(val);
			offCanvas.set(true);
		},
	};
}

export const openComponent: OpenComponentStore = createOpenComponent();
