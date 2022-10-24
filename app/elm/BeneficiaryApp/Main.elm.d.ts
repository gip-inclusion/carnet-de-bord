export interface ElmApp {
	ports: {
		[key: string]: any;
	};
}

export type Flags = { [key: string]: any };

export as namespace Elm;

export { Elm };
