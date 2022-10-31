export interface ElmApp {
	ports: {
		[key: string]: any;
	};
}

export type Flags = { [key: string]: any };

export namespace MainApp.Main {
	function init(options: { node?: HTMLElement | null; flags: Flags }): ElmApp;
}

export namespace BeneficiaryApp.Main {
	function init(options: { node?: HTMLElement | null; flags: Flags }): ElmApp;
}

export as namespace Elm;

export { Elm };
