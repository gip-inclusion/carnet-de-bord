export type CsvHeader = {
	label: string;
	key: string;
};
export const csvParseConfig = (headers: CsvHeader[]) => ({
	from: 2,
	columns: headers.map(({ key }) => key),
	trim: true,
	skip_empty_lines: true,
	delimiter: ';',
});
