import type { LabelValue } from '$lib/types';

export function getLabels(values: any, labelValues: LabelValue[]): string[] {
	if (!values) {
		return ['-'];
	}
	const labels: string[] = [];
	for (const value of values) {
		const lv = labelValues.find((lv) => lv.value === value);
		labels.push(lv.label);
	}
	return labels;
}
