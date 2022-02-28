export const csvParseConfig = (headers) => ({
	from: 2,
	columns: headers.map(({ key }) => key),
	trim: true,
	skip_empty_lines: true,
	delimiter: ';',
});
