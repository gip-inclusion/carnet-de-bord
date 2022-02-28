<script lang="ts" context="module">
	import Svelecte, { addFormatter, config } from 'svelecte';
	type RomeItem = {
		id: string;
		code: string;
		description: string;
		label: string;
	};
	type SvelecteItem = {
		value: string;
		id: string;
		label: string;
		title: string;
		name: string;
	};
</script>

<script lang="ts">
	import { GetRomeCodesDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { getClient } from '@urql/svelte';

	export let current: string;
	let selectedRome: string, selected: SvelecteItem;
	$: {
		selectedRome = current
			? current.split(' ').slice(-1)[0].replace('(', '').replace(')', '')
			: null;
	}
	$: {
		selected = current
			? {
					value: selectedRome,
					id: selectedRome,
					label: current,
					title: current,
					name: current,
			  }
			: null;
	}
	let initialOptions: Array<SvelecteItem> = [selected].filter((field) => Boolean(field));

	function postProcess(data: Array<RomeItem>): Array<SvelecteItem> {
		return data.map(({ id, code, label }) => ({
			value: code,
			id,
			label,
			title: label,
			name: label,
		}));
	}

	function romeRenderer(item: Record<string, string>, isSelected: boolean) {
		return `<span class="${isSelected ? 'font-bold' : ''}" title="${item.title}" >
				${item.label}
		</span>`;
	}
	addFormatter('renderRome', romeRenderer);

	config.i18n = {
		empty: 'Aucun élément',
		nomatch: 'Aucun élément ne correspond à votre recherche',
		max: (num: number) => `Vous avez choisi le nombre maximum d'éléments (${num})`,
		fetchBefore: 'Commencez à taper pour rechercher',
		fetchEmpty: 'Aucun élément ne correspond à votre recherche',
		collapsedSelection: (count: number) => `${count} éléments sélectionnés`,
	};

	function handleChange(event: CustomEvent<SvelecteItem>) {
		current = event?.detail?.label;
	}
	const client = getClient();
	const fetch: (search: string) => Promise<Array<SvelecteItem>> = (search) =>
		client
			.query(GetRomeCodesDocument, { search })
			.toPromise()
			.then(({ data, error }) => {
				if (error) {
					throw Error(error.toString());
				}
				return postProcess(data.search_rome_codes);
			})
			.catch((error) => {
				console.log('Error fetching ROME codes', { error, search });
				return [];
			});
</script>

<Svelecte
	options={initialOptions}
	bind:selection={selected}
	placeholder="Recherchez un métier ou un code ROME"
	{fetch}
	disableSifter={true}
	fetchResetOnBlur={false}
	fetchCallback={postProcess}
	renderer="renderRome"
	class="svelecte-control custom-svelecte cursor-pointer"
	valueField="code"
	labelField="label"
	clearable={true}
	on:change={handleChange}
/>
