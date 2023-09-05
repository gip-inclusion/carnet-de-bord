export const referentLabelInParens = (
	member: { memberType: 'referent' | string },
	orientationSystem: string | null
) => {
	if (member.memberType === 'referent') {
		let label = '(Référent';
		if (orientationSystem) {
			label += ` ${orientationSystem}`;
		}
		label += ')';
		return label;
	}
	return '';
};
