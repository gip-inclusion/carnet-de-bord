<script lang="ts">
	import { formatDateLocale } from '$lib/utils/date';
	import { Card } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import { displayFullName, displayMobileNumber } from '$lib/ui/format';
	import type { SearchNotebookMemberQuery } from '$lib/graphql/_gen/typed-document-nodes';

	export let beneficiary: SearchNotebookMemberQuery['search_notebook_members'][0]['notebook']['beneficiary'];
	export let href: string;

	$: orientationRequest =
		beneficiary?.orientationRequest?.length > 0 ? beneficiary.orientationRequest[0] : null;

	$: status =
		orientationRequest?.status == 'denied'
			? 'Refusée'
			: orientationRequest?.status == 'accepted'
			? 'Acceptée'
			: 'Envoyée';

	$: date =
		orientationRequest?.status == 'denied'
			? formatDateLocale(orientationRequest.decidedAt)
			: orientationRequest?.status == 'accepted'
			? formatDateLocale(orientationRequest.decidedAt)
			: formatDateLocale(orientationRequest?.createdAt);
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
		{#if orientationRequest}
			<div class="fr-card__end">
				<span class="fr-text--bold">
					<Text value="Demande de réorientation" />
				</span>
				<span class="fr-text--bold text-vert-cdb">
					<Text value="{status} le {date}" />
				</span>
			</div>
		{/if}
	</div>
</Card>
