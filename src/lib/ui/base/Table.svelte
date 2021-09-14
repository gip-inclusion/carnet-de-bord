<script context="module" lang="ts">
	import type { Beneficiary } from '$lib/graphql/_gen/typed-document-nodes';
	import type { TableHeader } from '$lib/types';
	let counter = 0;
</script>

<script lang="ts">
	counter++;
	export let id = `table-${counter}`;
	export let headers: TableHeader<Beneficiary>[] = [];
	export let rows: Beneficiary[] = [];
	export let bordered: boolean | null = false;
	let _bordered = bordered ? 'fr-table--bordered' : '';

	export let captionText: string;
	export let captionPosition: 'top' | 'bottom' | 'none' | 'hidden' | null = 'top';
	let captionClass: string;
	switch (captionPosition) {
		case 'top':
			captionClass = '';
			break;
		case 'none':
		case 'hidden':
			captionClass = 'fr-table--no-caption';
			break;
		case 'bottom':
			captionClass = 'fr-table--caption-bottom';
			break;
	}

	function getContent(h: TableHeader<Beneficiary>, r: Beneficiary) {
		if (typeof h.getHtml === 'function') {
			return h.getHtml(r);
		} else if (Object.keys(r).includes(h.getHtml)) {
			return r[h.getHtml];
		} else {
			return '-';
		}
	}
</script>

<div class={`w-full fr-table fr-table--layout-fixed ${captionClass} ${_bordered}`} {id}>
	{#if $$slots.blah}
		<slot name="blah" />
	{/if}
	<table>
		<caption>{captionText}</caption>
		<thead>
			<tr>
				{#each headers as header (`${header.id}`)}
					<th scope="col">{header.label || '&nbsp;'}</th>
				{/each}
				{#if $$slots.cellAction}
					<th>{' '}</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each rows as row (row.id)}
				<tr>
					{#each headers as header (`${row.id}-${header.id}`)}
						<td>{getContent(header, row)}</td>
					{/each}
					{#if $$slots.cellAction}
						<td><slot name="cellAction" slotData={row} /></td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
