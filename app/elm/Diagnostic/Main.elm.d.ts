export type Flags = {
	workSituation: string | undefined;
	workSituationDate: string | undefined;
	workSituationEndDate: string | undefined;
	rightRqth: boolean;
	geographicalArea: string | undefined;
	educationLevel: string | undefined;
	wantedJobs: string[];
	lastJobEndedAt: string | undefined;
	pePrincipalData: { [name: string]: string };
};

export type Ports = {};

export namespace Elm.Diagnostic.Main {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function init(options: { node?: HTMLElement | null; flags: Flags }): void;
}
