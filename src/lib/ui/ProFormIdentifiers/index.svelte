<script lang="ts">
	import { Radio } from '$lib/ui/base';
	import type { IdentifierCAF, IdentifierPE, IdentifierType, Option } from '$lib/types';
	import ProFormIdentifierPe from './ProFormIdentifierPE.svelte';
	import ProFormIdentifierCaf from './ProFormIdentifierCAF.svelte';
	import { createEventDispatcher, SvelteComponent } from 'svelte';
	import * as RD from '$lib/remoteData';
	import type { ExternalUser } from '$lib/types';
	import { displayFullName } from '../format';

	type ExternalUserOption = Option & { value: ExternalUser };

	const dispatch = createEventDispatcher();

	let forms: Record<IdentifierCAF | IdentifierPE, typeof SvelteComponent> = {
		CAF: ProFormIdentifierCaf,
		PE: ProFormIdentifierPe,
	};

	export let identifierType: IdentifierType | null;

	let users: Record<IdentifierType, RD.RemoteData<ExternalUser[], string>> = {
		CAF: RD.notAsked,
		PE: RD.notAsked,
		NoIdentifier: RD.notAsked,
	};

	let username: string;

	function externalUserToOption(externalUser: ExternalUser): ExternalUserOption {
		return {
			value: externalUser,
			label: `${displayFullName(externalUser)} (${externalUser.dateOfBirth})  ${
				externalUser.mobileOrPhoneNumber ? ` - ${externalUser.mobileOrPhoneNumber}` : ''
			}`,
			name: [
				externalUser.firstname,
				externalUser.lastname,
				externalUser.dateOfBirth,
				externalUser.mobileOrPhoneNumber,
			]
				.filter(Boolean)
				.join('-'),
		};
	}
	function handleSelectUser(externalUser: ExternalUser | null): void {
		dispatch('selectedUser', externalUser);
	}

	let userOptions: ExternalUserOption[] = [];
	$: {
		if (identifierType) {
			userOptions = (RD.getData(users[identifierType]) || []).map(externalUserToOption);
		}
	}
	$: handleSelectUser(userOptions.find(({ name }) => name === username)?.value);
</script>

{#if ['CAF', 'PE'].includes(identifierType)}
	<svelte:component this={forms[identifierType]} bind:users={users[identifierType]} />
	{#if userOptions.length > 0}
		{#key identifierType}
			<Radio caption="Usagers" options={userOptions} bind:selected={username} />
		{/key}
	{/if}
{/if}
