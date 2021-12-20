export const stringsMatch =
	(needle: string) =>
	(haystack?: string | null): boolean =>
		haystack && haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase());

export function filterFalsyProps(obj: Record<string, unknown>): Record<string, unknonw> {
	const result = {};
	for (const [k, v] of Object.entries(obj)) {
		if (v) {
			result[k] = v;
		}
	}
	return result;
}
