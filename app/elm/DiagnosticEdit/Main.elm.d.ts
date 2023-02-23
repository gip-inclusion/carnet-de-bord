export type RefSituation = { id: string; theme: string; description: string };
export type Situation = { id: string; refSituation?: RefSituation };

export type Flags = {
	refSituations: Array<RefSituation>;
	situations: Array<Situation>;
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
