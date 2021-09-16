export const stringsMatch =
	(needle: string) =>
	(haystack: string): boolean =>
		haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase());
