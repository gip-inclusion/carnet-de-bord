<script lang="ts">
	import { Card } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import { displayMobileNumber } from '$lib/ui/format';
	import type { Beneficiary } from '$lib/graphql/_gen/typed-document-nodes';

	export let beneficiary: Pick<
		Beneficiary,
		'id' | 'firstname' | 'lastname' | 'dateOfBirth' | 'mobileNumber'
	>;
	export let href: string;
</script>

<Card {href} horizontal={true}>
	<span slot="title">
		<div class="pb-1 flex flex-row font-bold text-xl tracking-wider">
			<div>{beneficiary.firstname}</div>
			<div class="pl-2">{beneficiary.lastname}</div>
		</div>
	</span>
	<span slot="description">
		<div class="pb-1 tracking-wider">{beneficiary.dateOfBirth}</div>
		<div class="pb-1 font-bold tracking-wider">
			<Text value={displayMobileNumber(beneficiary)} />
		</div>
	</span>
</Card>
