<script lang="ts">
	import { Card } from '$lib/ui/base';

	export let beneficiary: {
		id: string;
		firstname: string;
		lastname: string;
		mobileNumber?: string;
		dateOfBirth: Date;
	};
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
		<div class="pb-1 font-bold tracking-wider">{beneficiary.mobileNumber}</div>
	</span>
</Card>
