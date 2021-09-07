<script lang="ts">
	import type { NotebookMember } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import Button from './base/Button.svelte';
	import Text from './utils/Text.svelte';

	export let member: NotebookMember;
</script>

<div class="flex flex-col justify-center pl-16">
	<div>
		<h1>Membre du groupe de suivi</h1>
		<div class="py-2">
			<div class="py-2">
				<div class="flex gap-2">
					<div class="flex flex-row gap-2 font-bold text-2xl">
						<div>{member.professional.firstname}</div>
						<div>{member.professional.lastname}</div>
					</div>
				</div>
				<Text value={member.professional.position} />
			</div>

			<div class="py-2">
				<Text classNames="font-bold" value={member.professional.mobileNumber} />
				<Text value={member.professional.email} />
			</div>
		</div>
		<div class="py-2">
			<div class="py-2">
				<Text classNames="font-bold" value={member.professional.structure.name} />
			</div>

			<div class="py-2">
				<Text value={member.professional.structure.address1} />
				<Text value={member.professional.structure.address2} defaultValue="" />
				<div class="flex gap-2">
					<Text value={member.professional.structure.postalCode} />
					<Text value={member.professional.structure.city} />
				</div>
			</div>

			<Text value={member.professional.structure.email} />
		</div>
	</div>
	<div class="py-6">
		<Button
			on:click={() => {
				openComponent.close();
			}}>Fermer</Button
		>
	</div>
</div>
