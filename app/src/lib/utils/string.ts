export const capitalize = (lower: string): string => {
	if (!lower) return lower;
	return lower.charAt(0).toUpperCase() + lower.slice(1).toLowerCase();
};
