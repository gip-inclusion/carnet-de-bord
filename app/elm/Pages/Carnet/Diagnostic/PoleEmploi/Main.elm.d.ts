import type { ports as sentryPorts } from '$elm/Sentry';

export type Flags = {
	notebookId: String;
};

export interface ElmApp {
	ports: sentryPorts;
}

export namespace Elm.Pages.Carnet.Diagnostic.PoleEmploi.Main {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function init(options: { node?: HTMLElement | null; flags: Flags }): ElmApp;
}
