<script lang="ts">
	import {
		type GetNotebookByBeneficiaryIdQuery,
		type GetProfessionalOrientationOptionsQuery,
		RoleEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { GetProfessionalOrientationOptionsDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { Text } from '$lib/ui/utils';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { accountData, connectedUser } from '$lib/stores';
	import { operationStore, query } from '@urql/svelte';
	import { postApiJson } from '$lib/utils/post';
	import { captureException } from '$lib/utils/sentry';
	import { trackEvent } from '$lib/tracking/matomo';
	import { Button } from '$lib/ui/base';
	import { createEventDispatcher } from 'svelte';
	import type { Option } from '$lib/types';
	import { goto } from '$app/navigation';
	import { displayFullName } from '../format';
	import { Form, Select, Radio } from '$lib/ui/forms';
	import * as yup from 'yup';

	type Notebook = GetNotebookByBeneficiaryIdQuery['notebook'][number];
	type Member = Notebook['members'][number];
	export let members: Member[];
	export let notebookId: Notebook['id'];

	const dispatch = createEventDispatcher();

	type OrientationOption = GetProfessionalOrientationOptionsQuery['orientation'][number];
	let orientationOptions: Option[];
	const orientationSystemStore = operationStore(
		GetProfessionalOrientationOptionsDocument,
		{ professionalId: $connectedUser.professionalId },
		{ pause: !$accountData.professional }
	);
	query(orientationSystemStore);

	$: orientationOptions = $orientationSystemStore.data?.orientation.map(toOrientationOption) || [];
	function toOrientationOption(orientation: OrientationOption): Option {
		return { name: orientation.id, label: orientation.name };
	}

	const referent = 'referent';
	const options: Option[] = [
		{ name: referent, label: 'Oui' },
		{ name: 'no_referent', label: 'Non' },
	];

	async function addCurrentAccountToNotebookMembers(values: addMemberType) {
		trackEvent('pro', 'members', 'join_notebook_members');
		try {
			await postApiJson(`/v1/notebooks/${notebookId}/members`, {
				member_type: values.memberType,
				orientation: values.orientation,
			});
			dispatch('notebook-member-added');
		} catch (err) {
			if (
				err.status === 403 &&
				err.message === 'Unsufficient permission (structureId is missing)'
			) {
				forceLogout();
			} else {
				console.error(err);
				captureException(err);
			}
			return;
		}
	}

	function forceLogout() {
		goto('/auth/logout');
	}

	type NotebookMember = {
		fullname: string;
		memberType: Member['memberType'];
		structureName: string | undefined;
		position: string;
	};
	function toNotebookMember(member: Member): NotebookMember {
		return {
			fullname: member.account?.professional
				? displayFullName(member.account?.professional)
				: displayFullName(member.account?.orientation_manager),
			memberType: member.memberType,
			structureName: member.account?.professional?.structure.name,
			position:
				member.account.type === RoleEnum.OrientationManager
					? "Chargé d'orientation"
					: member.account?.professional?.position,
		};
	}

	const notebookMembers = members.map(toNotebookMember);

	const addMemberSchema = yup.object().shape({
		memberType: yup.string().oneOf(['referent', 'no_referent']).required(),
		orientation: yup.string().uuid().when('memberType', {
			is: 'referent',
			then: yup.string().uuid().required(),
		}),
	});
	type addMemberType = yup.InferType<typeof addMemberSchema>;

	$: initialValues = {
		memberType: 'no_referent',
		orientation: orientationOptions?.length === 1 ? orientationOptions[0].name : undefined,
	};
</script>

<div class="fr-table fr-table--layout-fixed !mb-0">
	{#if $accountData.professional}
		<div class="pb-6">
			<Dialog
				buttonFullWidth={true}
				outlineButton={false}
				title="Se rattacher"
				label="Se rattacher"
				showButtons={false}
			>
				<Form
					{initialValues}
					validationSchema={addMemberSchema}
					onSubmit={addCurrentAccountToNotebookMembers}
					let:form
				>
					<Radio
						legend="Bénéficiez-vous d'un mandat d'orientation en la qualité de référent ?"
						name="memberType"
						{options}
						ariaControls="orientation-system"
					/>
					{#if orientationOptions.length && form.memberType === 'referent'}
						<div class="fr-form-group pb-6">
							<Select
								options={orientationOptions}
								name="orientation"
								selectLabel="Dispositif d’accompagnement"
								required
							/>
						</div>
					{/if}
					<Button type="submit">Se rattacher</Button>
				</Form>
			</Dialog>
		</div>
	{/if}

	<table>
		<thead>
			<tr>
				<th style="width: 40%">Structure</th>
				<th style="width: 30%">Accompagnateur</th>
				<th style="width: 30%">Fonction</th>
			</tr>
		</thead>
		<tbody>
			{#each notebookMembers as member}
				<tr class:font-bold={member.memberType === 'referent'}>
					<td>
						{#if member.structureName}<Text value={member.structureName} />{/if}
					</td>
					<td>
						<div class="flex flex-row gap-2">
							<Text value={member.fullname} />
							{#if member.memberType === 'referent'}
								(référent)
							{/if}
						</div>
					</td>
					<td>
						<Text value={member.position} />
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
