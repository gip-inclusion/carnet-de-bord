export type Flags = {
	professionalSituation: {
		workSituation: string | undefined;
		workSituationDate: string | undefined;
		workSituationEndDate: string | undefined;
		rightRqth: boolean;
		geographicalArea: number | undefined;
		educationLevel: string | undefined;
		wantedJobs: string[];
		lastJobEndedAt: string | undefined;
	};
	peGeneralData: { [name: string]: string };
	personalSituations: {
		situations?: any;
		theme: string;
		createdAt?: string;
		creator: {
			professional?: { firstname?: string; lastname?: string; structure: { name: string } };
			orientation_manager?: { firstname?: string; lastname?: string };
		};
	}[];
};

export type Ports = {};

export namespace Elm.Diagnostic.Main {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function init(options: { node?: HTMLElement | null; flags: Flags }): void;
}
