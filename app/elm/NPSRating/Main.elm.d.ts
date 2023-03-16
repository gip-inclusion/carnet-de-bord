export type Flags = {
	backendAPI: String;
	serverUrl: String;
	token: String;
};

export namespace Elm.NPSRating.Main {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function init(options: { node?: HTMLElement | null; flags: Flags }): ElmApp;
}
