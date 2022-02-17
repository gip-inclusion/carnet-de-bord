<script lang="ts">
	import { Card } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import { displayMobileNumber } from '$lib/ui/format';
	import type { AdminStructure } from '$lib/graphql/_gen/typed-document-nodes';

	export let adminStructure: Pick<AdminStructure, 'id' | 'firstname' | 'lastname' | 'phoneNumbers'>;
	export let href: string;
</script>

<Card {href} horizontal={true}>
	<span slot="title">
		<div class="pb-1 flex flex-row font-bold text-xl tracking-wider">
			<div>{adminStructure.firstname}</div>
			<div class="pl-2">{adminStructure.lastname}</div>
		</div>
	</span>
	<span slot="description">
		<div class="pb-1 font-bold tracking-wider">
			<Text
				defaultValueClassNames="italic"
				defaultValue="Pas de téléphone"
				value={displayMobileNumber({ mobileNumber: adminStructure.phoneNumbers })}
			/>
		</div>
	</span>
</Card>
