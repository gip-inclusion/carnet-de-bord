export type KeyType = {
	byKey: Record<string, string>;
	byValue: Record<string, string>;
	keys: string[];
	values: string[];
	options: { label: string; value: string }[];
};

function revertMapKeysValues(mapByKey) {
	return Object.keys(mapByKey).reduce((map, key) => {
		const value = mapByKey[key];
		map[value] = key;
		return map;
	}, {});
}

function buildOptions(map: Record<string, string>) {
	return Object.keys(map).map((value) => {
		const label: string = map[value];
		return {
			label,
			value
		};
	});
}

function buildKeys(byKey: Record<string, string>): KeyType {
	return {
		byKey,
		byValue: revertMapKeysValues(byKey),
		keys: Object.keys(byKey),
		options: buildOptions(byKey),
		values: Object.values(byKey)
	};
}

export { buildKeys };
