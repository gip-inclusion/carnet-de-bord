import type { GetOrientationSystemQuery } from '$lib/graphql/_gen/typed-document-nodes';

type OrientationSystem = Pick<
	GetOrientationSystemQuery['orientation_system'][number],
	'name' | 'id' | 'orientationType'
>;

function getOrientationSystemLabel(orientationSystem: OrientationSystem | null): string {
	if (orientationSystem) {
		return ['Professionnel', 'Social', 'Socio-professionnel'].includes(orientationSystem.name)
			? orientationSystem.name
			: `${orientationSystem.name} (${orientationSystem.orientationType})`;
	}

	return '';
}

export { getOrientationSystemLabel };
