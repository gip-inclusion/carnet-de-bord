export type Situation = { id: string; theme: string; description: string };

export type Flags = {
	situations: Array<Situation>;
	focuses: Array<{ id: string; theme: string; situations: string[] }>;
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
