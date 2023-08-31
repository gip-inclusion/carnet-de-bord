export const isOriented = (beneficiary: { structures: unknown[] }) => {
	return beneficiary.structures.length !== 0;
};
