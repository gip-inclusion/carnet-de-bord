import type { Subscriber, Unsubscriber } from 'svelte/store';
import { writable } from 'svelte/store';

export const selectionStore = createSelectionStore();
export type SelectionStore<T> = {
	reset: () => void;
	toggle: (id: string, value: T) => void;
	subscribe: (this: void, run: Subscriber<Record<string, T>>) => Unsubscriber;
};
export function createSelectionStore<T>(): SelectionStore<T> {
	const { set, subscribe, update } = writable({} as Record<string, T>);
	return {
		reset() {
			set({});
		},
		toggle(id: string, value: T) {
			update((data) => {
				if (data[id]) {
					const { [id]: _, ...rest } = data;
					return rest;
				}
				return { ...data, [id]: value };
			});
		},
		subscribe,
	};
}

export const selectionContextKey = {};
