export interface ElmApp {
	ports: {
		[key: string]: any;
	};
}

export type Flags = null;

export namespace Main {
	function init(options: { node?: HTMLElement | null; flags: Flags }): ElmApp;
}

export as namespace Elm;

export { Elm };
