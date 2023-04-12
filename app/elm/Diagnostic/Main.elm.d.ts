import type {
	RomeCode,
	ProfessionalProject,
	RefSituation as _RefSituation,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { ports as sentryPorts } from '$elm/Sentry';

export type Creator = {
	professional?: { firstname?: string; lastname?: string; structure: { name: string } };
	orientation_manager?: { firstname?: string; lastname?: string };
};

export type RefSituation = Pick<_RefSituation, 'id' | 'theme' | 'description'>;

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
	notebookId: string;
};

export type Ports = {};

export interface ElmApp {
	ports: sentryPorts;
}

export namespace Elm.Diagnostic.Main {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function init(options: { node?: HTMLElement | null; flags: Flags }): ElmApp;
}
