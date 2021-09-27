import type { Readable, Writable } from 'svelte/store';
import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';
import { offCanvas } from './offCanvas';

export type OpenComponentType = {
	component: typeof SvelteComponent;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	props?: Record<string, any>;
} | null;

export type OpenComponentStore = Readable<OpenComponentType[]> & {
	close: () => void;
	open: (value: OpenComponentType) => void;
	replace: (value: OpenComponentType) => void;
};

function createOpenComponent() {
	const openComponent: Writable<OpenComponentType[]> = writable(null);

	const { subscribe, set } = openComponent;
	const stack = [];
	set(stack);

	return {
		subscribe,
		close: () => {
			stack.pop();
			set(stack);
			offCanvas.set(stack.length > 0);
		},
		open: (value) => {
			stack.push(value);
			set(stack);
			offCanvas.set(true);
		},
		replace: (value) => {
			stack.pop();
			stack.push(value);
			set(stack);
			offCanvas.set(true);
		},
	};
}

export const openComponent: OpenComponentStore = createOpenComponent();
