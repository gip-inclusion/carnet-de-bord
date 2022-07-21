<script lang="ts">
	import { Card } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import { displayFullName, displayMobileNumber } from '$lib/ui/format';
	import type { Beneficiary } from '$lib/graphql/_gen/typed-document-nodes';

	export let beneficiary: Pick<
		Beneficiary,
		'id' | 'firstname' | 'lastname' | 'dateOfBirth' | 'mobileNumber'
	>;
	export let href: string;
</script>

<Card {href}>
	<span slot="title">
		{displayFullName(beneficiary)}
	</span>
	<div slot="description">
		<span class="pb-1 tracking-wider">{beneficiary.dateOfBirth}</span>
		<span class="pb-1 font-bold tracking-wider">
			<Text value={displayMobileNumber(beneficiary)} />
		</span>
	</div>
</Card>
