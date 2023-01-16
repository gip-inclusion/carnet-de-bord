export namespace MainApp.Main {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function init(options: { node?: HTMLElement | null; flags: Flags }): ElmApp;
}
export interface ElmApp {
	ports: {
		[key: string]: any;
	};
}

export type Flags = { [key: string]: any };

export as namespace Elm;

export { Elm };
