export type Creator = {
	professional?: { firstname?: string; lastname?: string; structure: { name: string } };
	orientation_manager?: { firstname?: string; lastname?: string };
};

export type Flags = {
	professionalSituation: {
		workSituation: string | undefined;
		workSituationDate: string | undefined;
		workSituationEndDate: string | undefined;
		rightRqth: boolean;
		educationLevel: string | undefined;
		lastJobEndedAt: string | undefined;
	};
	professionalProjects: {
		id: string;
		rome: { id: string; label: string };
		createdAt: string;
		updatedAt: string;
		mobilityRadius: Number | undefined;
	}[];
	peGeneralData: { [name: string]: string };
	personalSituations: {
		refSituation?: {
			id: string;
			description: string;
			theme: string;
		};
		createdAt: string;
		creator?: Creator;
	}[];
};

export type Ports = {};

export namespace Elm.Diagnostic.Main {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function init(options: { node?: HTMLElement | null; flags: Flags }): void;
}
