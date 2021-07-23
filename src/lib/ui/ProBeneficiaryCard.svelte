<script lang="ts">
	export let beneficiary: {
		id: string;
		firstname: string;
		lastname: string;
		mobileNumber?: string;
		dateOfBirth: Date;
	};
</script>

<div class="card">
	<div class="flex flex-col">
		<div class="pb-1 flex flex-row font-bold text-xl tracking-wider">
			<div>{beneficiary.firstname}</div>
			<div class="pl-2">{beneficiary.lastname}</div>
		</div>
		<div class="pb-1 tracking-wider">{beneficiary.dateOfBirth}</div>
		<div class="pb-1 font-bold tracking-wider">{beneficiary.mobileNumber}</div>
	</div>
	<i class="text-3xl ri-arrow-right-line" />
</div>

<style lang="postcss">
	.card {
		@apply flex;
		@apply flex-row;
		@apply justify-between;
		@apply items-center;

		@apply px-6;
		@apply py-4;

		@apply bg-gray-100;

		@apply border-l-8;
		@apply border-gray-300;
		@apply hover:border-gray-800;

		@apply hover:cursor-pointer;
	}
</style>
