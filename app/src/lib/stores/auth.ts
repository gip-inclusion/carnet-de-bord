import type { JwtPayload } from '$lib/utils/getJwt';
import { type Writable, writable } from 'svelte/store';

export const connectedUser: Writable<null | JwtPayload> = writable(null);
