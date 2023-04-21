export type Flags = {
	rsaRight?: String;
	rsaClosureDate?: String;
	rsaClosureReason?: String;
	rsaSuspensionReason?: String;
};

export namespace Elm.RsaRightNotice.Main {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function init(options: { node?: HTMLElement | null; flags: Flags }): ElmApp;
}
