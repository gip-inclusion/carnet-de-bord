import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

type CrispData = any; // eslint-disable-line @typescript-eslint/no-explicit-any
export const crispData: Writable<null | CrispData> = writable(null);
