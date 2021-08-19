type GetHtml<Data> = keyof Data | ((data: Data) => string);

export type TableHeader<Data> = {
	id: string;
	label: string;
	getHtml: GetHtml<Data>;
};

export interface Option {
	name: string;
	label: string;
}

export type MenuItem = {
	id: string;
	path: string;
	label: string;
};
export type IdentifierCAF = 'CAF';
export type IdentifierPE = 'PE';
export type NoIdentifier = 'NoIdentifier';
export type IdentifierType = IdentifierCAF | IdentifierPE | NoIdentifier;
