export type Flags = {
	situations: Array<{ id: string; theme: string; description: string }>;
};

export type Ports = {};

export namespace Elm.DiagnosticEdit.Main {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function init(options: { node?: HTMLElement | null; flags: Flags }): void;
}
