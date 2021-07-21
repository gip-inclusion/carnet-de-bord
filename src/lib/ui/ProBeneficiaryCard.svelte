<script lang="ts">
	import type { Beneficiary } from '$lib/_gen/typed-document-nodes';

	export let beneficiary: Pick<
		Beneficiary,
		'id' | 'firstname' | 'lastname' | 'email' | 'mobile_number'
	>;
</script>

<div class="border-2 m-2">
	<div class="flex flex-row">
		<div class="p-2 bg-blue-200" />
		<div>
			<div>{beneficiary.firstname}</div>
			<div class="pl-2">{beneficiary.lastname}</div>
		</div>
	</div>
</div>
