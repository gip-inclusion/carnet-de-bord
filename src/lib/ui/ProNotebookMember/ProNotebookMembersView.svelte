<script lang="ts">
	import type { NotebookMember } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { Button } from '../base';
	import { Text } from '../utils';
	import ProNotebookMemberInvitation from './ProNotebookMemberInvitation.svelte';
	import ProNotebookMemberView from './ProNotebookMemberView.svelte';

	export let notebookId: string;
	export let beneficiaryFirstname: string;
	export let beneficiaryLastname: string;
	export let members: NotebookMember[];

	const openMemberInfo = (member: NotebookMember) => {
		openComponent.open({ component: ProNotebookMemberView, props: { member } });
	};

	const openInviteMember = () => {
		openComponent.open({
			component: ProNotebookMemberInvitation,
			props: {
				beneficiaryFirstname,
				beneficiaryLastname,
				notebookId,
				professionalIds: members ? members.map((m) => m.professional.id) : []
			}
		});
	};
</script>

<div class="flex flex-row w-full justify-between">
	<Button
		on:click={() => {
			openInviteMember();
		}}>Ajouter un accompagnateur</Button
	>
</div>
<div class="py-8">
	{#each members as member, i}
		<div
			class:bg-gray-100={i % 2 === 0}
			class="flex hover:ml-2 cursor-pointer gap-2 p-2 mb-2 w-full border-l-2 border-france-blue"
			on:click={() => {
				openMemberInfo(member);
			}}
		>
			<div class="flex flex-col w-1/2 min-w-0">
				<div class="text-gray-text-alt">Structure</div>
				<Text
					classNames="font-bold overflow-ellipsis overflow-hidden whitespace-nowrap"
					value={member.professional.structure.name}
				/>
			</div>
			<div class="flex flex-col w-1/4 min-w-0">
				<div class="text-gray-text-alt">Accompagnateur</div>
				<div
					class="flex flex-row gap-2 font-bold overflow-ellipsis overflow-hidden whitespace-nowrap"
				>
					<Text classNames="font-bold" value={member.professional.firstname} />
					<Text classNames="font-bold" value={member.professional.lastname} />
				</div>
			</div>
			<div class="flex flex-col w-1/4 min-w-0">
				<div class="text-gray-text-alt">Fonction</div>
				<Text
					classNames="font-bold overflow-ellipsis overflow-hidden whitespace-nowrap"
					value={member.professional.position}
				/>
			</div>
			<button>
				<i class="text-2xl text-france-blue ri-arrow-right-line" />
			</button>
		</div>
	{/each}
</div>
