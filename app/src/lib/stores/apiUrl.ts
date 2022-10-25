import { writable, type Writable } from 'svelte/store';

export const backendAPI: Writable<null | string> = writable(null);
export const graphqlAPI: Writable<null | string> = writable(null);
