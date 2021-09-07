import type { Account } from '$lib/types';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { SvelteComponent } from 'svelte';

export const account: Writable<null | Account> = writable(null);

export const offCanvas: Writable<boolean> = writable(false);
export const openComponent: Writable<typeof SvelteComponent> = writable(null);
