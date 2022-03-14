import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

type CrispData = {
	username?: string;
	firstname?: string;
	lastname?: string;
	email?: string;
	mobileNumber?: string;
	position?: string;
	structure?: {
		name?: string;
		deployment?: { label?: string };
	};
};
export const crispData: Writable<null | CrispData> = writable(null);
