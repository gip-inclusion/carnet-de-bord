import type { ports as sentryPorts } from '$elm/Sentry';
import type { portIn, portOut } from '$elm/typeTools';
import type { ApiFlag } from '$elm/Api';
export type Flags = {
	theme: String;
	targetId: String;
	api: ApiFlag;
};

export type StatusUpdate = { actionId: string; status: string };

export type AddAction = {
	targetId: string;
	action: string;
	status: string;
};

export interface ElmApp {
	ports: sentryPorts & {
		updateStatus: portOut<StatusUpdate>;
		addAction: portOut<AddAction>;
		addFailed: portIn<string>;
		updateStatusFailed: portIn<string>;
		refreshActions: portIn<string>;
	} & {
		[key: string]: any;
	};
}

export namespace Elm.Pages.Pro.Carnet.Action.List.Main {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function init(options: { node?: HTMLElement | null; flags: Flags }): ElmApp;
}
