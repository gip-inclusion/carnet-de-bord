<script lang="ts">
	import type { IBeneficiary } from 'src/global';

	export let beneficiary: IBeneficiary;
</script>

<div class="border-2 m-2">
	<div class="flex flex-row">
		<div class="p-2 bg-blue-200" />
		<div>
			<div>{beneficiary.civilStatus.firstname}</div>
			<div class="pl-2">{beneficiary.civilStatus.lastname}</div>
		</div>
	</div>
</div>
