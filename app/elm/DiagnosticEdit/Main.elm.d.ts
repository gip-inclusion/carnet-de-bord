import type { RomeCode, ProfessionalProject } from '$lib/graphql/_gen/typed-document-nodes';

export type RefSituation = { id: string; theme: string; description: string };
export type Situation = { id: string; refSituation?: RefSituation };

export type ProfessionalProjectElm = Pick<
	ProfessionalProject,
	'id' | 'updatedAt' | 'createdAt' | 'mobilityRadius'
> & { rome?: Pick<RomeCode, 'id' | 'label'> };

export type Flags = {
	refSituations: Array<RefSituation>;
	situations: Array<Situation>;
	professionalProjects: Array<ProfessionalProjectElm>;
};

export interface ElmApp {
	ports: {
		[key: string]: any;
	};
}

export namespace Elm.DiagnosticEdit.Main {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function init(options: { node?: HTMLElement | null; flags: Flags }): ElmApp;
}
