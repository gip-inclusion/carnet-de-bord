type OrientationSystem = {
	name: string;
	id: string;
	orientationType: string;
};

function getOrientationSystemLabel(orientationSystem: OrientationSystem | null): string {
	if (orientationSystem) {
		return ['Professionnel', 'Social', 'Socio-professionnel'].includes(orientationSystem.name)
			? orientationSystem.name
			: `${orientationSystem.name} (${orientationSystem.orientationType})`;
	}

	return '';
}

export { getOrientationSystemLabel };
