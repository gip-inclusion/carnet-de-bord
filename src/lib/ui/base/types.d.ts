type GetHtml<Data> = keyof Data | ((data: Data) => string);

export type TableHeader<Data> = {
	id: string;
	label: string;
	getHtml: GetHtml<Data>;
};

export type Option = {
	name: string;
	label: string;
};
