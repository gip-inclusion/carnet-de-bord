import type { RefSituation } from '$lib/graphql/_gen/typed-document-nodes';
import type { LabelName } from '$lib/types';

export function buildSituationOptions(
	refSituations: Pick<RefSituation, 'id' | 'description' | 'theme'>[] = []
): LabelName[] {
	return refSituations.map(({ description }) => ({
		label: description,
		name: description,
	}));
}
