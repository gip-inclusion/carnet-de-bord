import type { RomeCode, ProfessionalProject } from '$lib/graphql/_gen/typed-document-nodes';

export type Creator = {
	professional?: { firstname?: string; lastname?: string; structure: { name: string } };
	orientation_manager?: { firstname?: string; lastname?: string };
};

export type RefSituation = { id: string; theme: string; description: string };

export type ProfessionalProjectElm = Pick<
	ProfessionalProject,
	| 'id'
	| 'updatedAt'
	| 'createdAt'
	| 'mobilityRadius'
	| 'hourlyRate'
	| 'contract_type'
	| 'employment_type'
> & {
	rome?: Pick<RomeCode, 'id' | 'label'>;
	updater?: Creator;
};

export type Flags = {
	professionalSituation: {
		workSituation: string | undefined;
		workSituationDate: string | undefined;
		workSituationEndDate: string | undefined;
		rightRqth: boolean;
		educationLevel: string | undefined;
		lastJobEndedAt: string | undefined;
	};
	professionalProjects: ProfessionalProjectElm[];
	peGeneralData: { [name: string]: string };
	personalSituations: {
		refSituation?: RefSituation;
		createdAt: string;
		creator?: Creator;
	}[];
};

export type Ports = {};

export namespace Elm.Diagnostic.Main {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function init(options: { node?: HTMLElement | null; flags: Flags }): void;
}
