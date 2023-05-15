import type {
	ContractTypeEnum,
	EmploymentTypeEnum,
	GetNotebookQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { ProfessionalProjectElm, RefSituation } from 'elm/Diagnostic/Main.elm';

export type Situation = { id: string; refSituation?: RefSituation };

export type ProfessionalProjectOut = {
	id: string?;
	mobilityRadius: number?;
	romeCodeId: string?;
	employmentTypeId: EmploymentTypeEnum?;
	contractTypeId: ContractTypeEnum?;
	hourlyRate: number?;
};

export type Flags = {
	refSituations: GetNotebookQuery['refSituations'];
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
