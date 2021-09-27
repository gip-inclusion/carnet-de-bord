import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const isMenuOpened: Writable<boolean> = writable(false);
