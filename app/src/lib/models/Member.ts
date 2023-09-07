export const referentLabelInParens = (
	member: { memberType: 'referent' | string },
	orientationSystem: string | null
) => {
	if (member.memberType !== 'referent') {
		return '';
	}
	if (orientationSystem) {
		return `(Référent ${orientationSystem})`;
	}
	return '(Référent)';
};
