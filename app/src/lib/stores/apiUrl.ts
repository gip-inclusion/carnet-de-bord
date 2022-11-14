import { type Writable, writable } from 'svelte/store';

export const backendAPI: Writable<null | string> = writable(null);
export const graphqlAPI: Writable<null | string> = writable(null);
