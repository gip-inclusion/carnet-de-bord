import type { Account } from '$lib/types';
import { Writable, writable } from 'svelte/store';

export const account: Writable<null | Account> = writable(null);
