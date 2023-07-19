<script lang="ts">
	import View from './JoinNotebookMembersView.svelte';
	import type { OrientationOption, addMemberType } from './JoinNotebookMembersView.svelte';

	import { postApiJson } from '$lib/utils/post';
	import { captureException } from '$lib/utils/sentry';
	import { trackEvent } from '$lib/tracking/matomo';
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';

	import {
		GetProfessionalOrientationOptionsDocument,
		type Notebook,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { accountData, connectedUser } from '$lib/stores';
	import { operationStore, query } from '@urql/svelte';

	export let notebookId: Notebook['id'];

	const orientationSystemStore = operationStore(
		GetProfessionalOrientationOptionsDocument,
		{ professionalId: $connectedUser.professionalId },
		{ pause: !$accountData.professional }
	);
	query(orientationSystemStore);

	let orientations: OrientationOption[];
	$: orientations = $orientationSystemStore.data?.orientation || [];

	const dispatch = createEventDispatcher();
	async function addCurrentAccountToNotebookMembers(values: addMemberType) {
		trackEvent('pro', 'members', 'join_notebook_members');
		try {
			await postApiJson(`/v1/notebooks/${notebookId}/members`, {
				member_type: values.memberType,
				orientation: values.orientation,
			});
			dispatch('joined-notebook');
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
</script>

<View {orientations} onSubmit={addCurrentAccountToNotebookMembers} />
