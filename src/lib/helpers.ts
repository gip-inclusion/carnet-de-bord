export const stringsMatch =
	(needle: string) =>
	(haystack?: string | null): boolean =>
		haystack && haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase());
