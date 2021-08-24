import type { Account } from '$lib/types';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const account: Writable<null | Account> = writable(null);
