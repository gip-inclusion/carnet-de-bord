<script lang="ts" context="module">
	import Svelecte, { addFormatter, config } from 'svelecte';
	type RomeItem = {
		id: string;
		label: string;
	};
</script>

<script lang="ts">
	import { GetRomeCodesDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { getClient } from '@urql/svelte';

	export let value: string[];
	export let options: RomeItem[];
	export let romeSelectorId: string;

	function romeRenderer(item: RomeItem, isSelected: boolean) {
		return `<span class="${isSelected ? 'font-bold' : ''}" title="${item.label}" >
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

	const client = getClient();
	const fetch: (search: string) => Promise<RomeItem[]> = (search) =>
		client
			.query(GetRomeCodesDocument, { search, labels: [] })
			.toPromise()
			.then(({ data, error }) => {
				if (error) {
					throw Error(error.toString());
				}
				return data.search_rome_codes;
			})
			.catch((error) => {
				console.error('Error fetching ROME codes', { error, search });
				return [];
			});
</script>

<Svelecte
	{options}
	bind:value
	placeholder="Recherchez un métier ou un code ROME"
	inputId={romeSelectorId}
	{fetch}
	disableSifter={true}
	fetchResetOnBlur={false}
	renderer="renderRome"
	class="svelecte-control custom-svelecte cursor-pointer"
	valueField="id"
	labelField="label"
	clearable={true}
	multiple={true}
	max={3}
	name="professionalProject[]"
/>
