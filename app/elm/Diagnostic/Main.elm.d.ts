export type Flags = {
	rightRsa: string | undefined;
	workSituation: string | undefined;
	workSituationDate: string | undefined;
	workSituationEndDate: string | undefined;
	rightRqth: boolean;
	rightAre: boolean;
	rightAss: boolean;
	rightBonus: boolean;
	geographicalArea: string | undefined;
	educationLevel: string | undefined;
	wantedJobs: string[];
};

export type Ports = {};

export namespace Elm.Diagnostic.Main {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function init(options: { node?: HTMLElement | null; flags: Flags }): ElmAppWithPort;
}

type ElmAppWithPort = {
	ports: {
		refresh: (f: Flags) => void;
	};
};
