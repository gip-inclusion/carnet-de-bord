<script lang="ts">
	import { Card } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import { displayFullName, displayMobileNumber } from '$lib/ui/format';
	import type { AdminStructure } from '$lib/graphql/_gen/typed-document-nodes';

	export let adminStructure: Pick<
		AdminStructure,
		'id' | 'firstname' | 'lastname' | 'phoneNumbers' | 'email'
	>;
	export let href: string = null;
</script>

<Card {href} horizontal hideArrow>
	<span slot="title">
		<div class="pb-1 flex flex-row font-bold text-xl tracking-wider">
			<Text
				value={displayFullName(adminStructure)}
				defaultValue="Pas de nom"
				defaultValueClassNames="italic"
			/>
		</div>
	</span>
	<span slot="description">
		<div class="pb-1 font-bold tracking-wider">
			<Text
				defaultValueClassNames="italic"
				defaultValue="Pas d'email"
				value={adminStructure.email}
			/>
		</div>
		<div>
			<Text
				defaultValueClassNames="italic"
				defaultValue="Pas de téléphone"
				value={displayMobileNumber({ mobileNumber: adminStructure.phoneNumbers })}
			/>
		</div>
	</span>
</Card>
