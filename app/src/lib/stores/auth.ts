import type { JwtPayload } from '$lib/utils/getJwt';
import { writable, type Writable } from 'svelte/store';

export const connectedUser: Writable<null | JwtPayload> = writable(null);
export const token: Writable<null | string> = writable(null);
