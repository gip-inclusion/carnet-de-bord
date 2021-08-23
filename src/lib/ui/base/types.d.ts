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
	name: string;
	path: string;
	label: string;
};
