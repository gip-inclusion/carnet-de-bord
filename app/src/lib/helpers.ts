import type { AppointmentUI } from '$lib/models/Appointment';

export const stringsMatch =
	(needle: string) =>
	(haystack?: string | null): boolean => {
		if (!needle) {
			return true;
		}
		return haystack && haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase());
	};

export const pluck = function pluck<T>(
	props: string[],
	obj: Record<string, T>
): Record<keyof typeof obj, T> {
	const result = {};
	for (const prop in obj) {
		if (!props.includes(prop)) {
			result[prop] = obj[prop];
		}
	}
	return result;
};

export function trimToNull(arg0: string): string {
	const trimmed = arg0.trim();
	return trimmed === '' ? null : trimmed;
}

export function filterFalsyProps(obj: Record<string, unknown>): Record<string, unknown> {
	const result = {};
	for (const [k, v] of Object.entries(obj)) {
		if (v) {
			result[k] = v;
		}
	}
	return result;
}

export const by = <T>(sorter: (data: T) => number, order = 'ASC'): ((d1: T, d2: T) => number) => {
	let a = 1;
	let b = -1;
	if (order === 'DESC') {
		a = -1;
		b = 1;
	}
	return (d1: T, d2: T) => a * sorter(d1) + b * sorter(d2);
};

export function pluralize(word: string, quantity: number, plural?: string): string {
	if (quantity > 1) {
		return plural ?? `${word}s`;
	}
	return word;
}

export function jsonCopy(
	object: Record<string, unknown> | Array<Record<string, unknown>> | AppointmentUI | AppointmentUI[]
) {
	return JSON.parse(JSON.stringify(object));
}
