<script type="ts">
	import type { Beneficiary, Professional } from '$lib/graphql/_gen/typed-document-nodes';
	import { formatDateLocale } from '$lib/utils/date';
	import { createEventDispatcher } from 'svelte';
	import { Button, IconButton } from '$lib/ui/base';
	import { displayFullName, displayMobileNumber } from '$lib/ui/format';
	import { Text } from '$lib/ui/utils';

	const dispatch = createEventDispatcher();

	export let beneficiary: Pick<
		Beneficiary,
		| 'id'
		| 'firstname'
		| 'lastname'
		| 'mobileNumber'
		| 'email'
		| 'dateOfBirth'
		| 'address1'
		| 'address2'
		| 'city'
		| 'postalCode'
		| 'cafNumber'
		| 'peNumber'
	>;
	export let lastUpdateDate: string;
	export let lastUpdateFrom: Pick<Professional, 'firstname' | 'lastname'>;
</script>

<div class="flex flex-col space-y-6">
	<div>
		{#if lastUpdateDate}
			<div class="text-sm">
				Informations mises à jour le {formatDateLocale(lastUpdateDate, {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})} par
				{displayFullName(lastUpdateFrom)}
			</div>
		{/if}
		<div class="flex">
			<h1 class="fr-h1 flex-1 bf-500">
				{displayFullName(beneficiary)}
			</h1>
			<div>
				<IconButton
					on:click={() => dispatch('print')}
					icon="ri-printer-line"
					ariaLabel="Imprimer"
				/>
			</div>
		</div>
		<div class="-mt-2">Né le {formatDateLocale(beneficiary.dateOfBirth)}</div>
	</div>

	<h2 class="fr-h4 bf-500">Informations personnelles</h2>
	<!-- extract Infos -->
	<div class="flex flex-row space-x-4">
		<div class="w-full">
			<div class="text-lg font-bold">{displayMobileNumber(beneficiary)}</div>
			<div>{beneficiary.email}</div>
			<address class="mt-2 not-italic">
				{@html [beneficiary.address1, beneficiary.address2]
					.filter(Boolean)
					.concat(`${beneficiary.postalCode} ${beneficiary.city}`)
					.join('<br>')}
			</address>
		</div>
		<div class="w-full">
			<strong class="text-base bf-500">Identifiant Pôle emploi</strong>
			<Text classNames="mb-2" value={beneficiary.peNumber} />
			<strong class="bf-500">Identifiant CAF</strong>
			<Text value={beneficiary.cafNumber} />
		</div>
	</div>
	<Button disabled classNames="self-start" on:click={() => dispatch('edit')} outline>
		Mettre à jour
	</Button>
</div>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}
</style>
