import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

type CrispData = any;
export const crispData: Writable<null | CrispData> = writable(null);
