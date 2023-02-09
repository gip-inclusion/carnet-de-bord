export type Flags = {
	rightAre: boolean;
	rightAss: boolean;
	rightBonus: boolean;
	rightRsa: string | undefined;
};

export type Ports = {};

export namespace Elm.PersonalInfo.Main {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function init(options: { node?: HTMLElement | null; flags: Flags }): void;
}
