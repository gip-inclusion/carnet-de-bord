import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const offCanvas: Writable<boolean> = writable(false);
