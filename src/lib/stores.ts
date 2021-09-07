import type { Account } from '$lib/types';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { SvelteComponent } from 'svelte';

export const account: Writable<null | Account> = writable(null);

export const offCanvas: Writable<boolean> = writable(false);

function createOpenComponent() {
	const openComponent: Writable<{
		component: typeof SvelteComponent;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		props: Record<string, any>;
	}> = writable(null);

	const { subscribe, set } = openComponent;

	return {
		subscribe,
		close: () => {
			set(null);
			offCanvas.set(false);
		},
		open: (value) => {
			set(value);
			offCanvas.set(true);
		}
	};
}

export const openComponent = createOpenComponent();
