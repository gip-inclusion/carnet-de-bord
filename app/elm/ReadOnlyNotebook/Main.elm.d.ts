export namespace ReadOnlyNotebook.Main {
	function init(options: { node?: HTMLElement | null; flags: Flags }): ElmApp;
}
export interface ElmApp {
	ports: {
		[key: string]: any;
	};
}

export type Flags = { [key: string]: any };

export as namespace ElmRo;

export { ElmRo };
