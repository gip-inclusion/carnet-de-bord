<script lang="ts">
	import type {
		Beneficiary,
		OrientationManager,
		Professional,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { formatDateLocale } from '$lib/utils/date';
	import { displayFullName, displayMobileNumber } from '$lib/ui/format';
	import { Text } from '$lib/ui/utils';

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
	export let lastUpdateFrom: Pick<Professional | OrientationManager, 'firstname' | 'lastname'>;
</script>

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
	<h1 class="fr-h1 flex-1 text-france-blue">
		{displayFullName(beneficiary)}
	</h1>
</div>
<div class="-mt-2">Né le {formatDateLocale(beneficiary.dateOfBirth)}</div>

<h2 class="fr-h4 text-france-blue">Informations personnelles</h2>
<!-- extract Infos -->
<div class="flex flex-row space-x-4">
	<div class="w-full">
		<div class="text-lg font-bold">{displayMobileNumber(beneficiary)}</div>
		<div>{beneficiary.email}</div>
		<address class="mt-2 not-italic">
			{@html [beneficiary.address1, beneficiary.address2]
				.filter((field) => Boolean(field))
				.concat(`${beneficiary.postalCode} ${beneficiary.city}`)
				.join('<br>')}
		</address>
	</div>
	<div class="w-full">
		<strong class="text-base text-france-blue">Identifiant Pôle emploi</strong>
		<Text classNames="mb-2" value={beneficiary.peNumber} />
		<strong class="text-france-blue">Identifiant CAF/MSA</strong>
		<Text value={beneficiary.cafNumber} />
	</div>
</div>
