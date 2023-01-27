import type { GetOrientationSystemQuery } from '$lib/graphql/_gen/typed-document-nodes';

export type OrientationSystem = Pick<
	GetOrientationSystemQuery['orientation_system'][number],
	'name' | 'orientationType'
>;

export function getOrientationSystemLabel(orientationSystem: OrientationSystem | null): string {
	if (orientationSystem) {
		let orientationTypeLabel: string;
		if (orientationSystem.orientationType == 'pro') {
			orientationTypeLabel = 'Professionnel';
		} else if (orientationSystem.orientationType == 'social') {
			orientationTypeLabel = 'Social';
		} else if (orientationSystem.orientationType == 'sociopro') {
			orientationTypeLabel = 'Socio-professionel';
		}

		return ['Professionnel', 'Social', 'Socio-professionnel'].includes(orientationSystem.name)
			? orientationSystem.name
			: `${orientationSystem.name} (${orientationTypeLabel})`;
	}

	return '';
}
