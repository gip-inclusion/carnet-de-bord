import type { ContractTypeEnum, EmploymentTypeEnum } from '$lib/graphql/_gen/typed-document-nodes';
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
	refSituations: Array<RefSituation>;
	situations: Array<Situation>;
	professionalProjects: Array<ProfessionalProjectElm>;
	serverUrl: string;
	token: string;
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
