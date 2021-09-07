<script context="module" lang="ts">
	import type { GetAccountQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetAccountDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { getSegments } from '$lib/routes';
	import { Breadcrumbs } from '$lib/ui/base';
	import type { MenuItem } from '$lib/ui/base/types';
	import { FooterCDB, HeaderCDB } from '$lib/ui/index';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = async ({ session }) => {
		const accountId = session.user.id;
		const result = operationStore(GetAccountDocument, { accountId });

		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	import { account, openComponent } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let result: OperationStore<GetAccountQuery>;

	query(result);

	const close = () => {
		openComponent.close();
	};

	result.subscribe((result) => {
		if (result.data) {
			const acc = result.data.account_by_pk;
			if (acc) {
				const { username, onboardingDone, confirmed } = acc;
				const { firstname, lastname, email, mobileNumber, position } = acc.professional;
				$account = {
					username,
					onboardingDone,
					confirmed,
					firstname,
					lastname,
					email,
					mobileNumber,
					position
				};

				if (!onboardingDone && $page.path !== '/pro/moncompte') {
					goto('/pro/moncompte');
				}
			}
		}
	});

	const menuItems: MenuItem[] = [
		{ id: 'accueil', path: '/pro/accueil', label: 'Accueil' },
		{ id: 'annuaire', path: '/pro/annuaire', label: 'Annuaire des bénéficiaires' }
	];

	$: segments = getSegments($page.path);
</script>

<HeaderCDB {menuItems} />

<div class="fr-container" style="min-height: calc(100vh - 200px)">
	<Breadcrumbs {segments} />
	<LoaderIndicator {result}>
		<slot />
		{#if $openComponent}
			<div on:click={close} class="!m-0 z-10 fixed inset-0 transition-opacity">
				<div class="absolute inset-0 bg-black opacity-50" tabindex="0" />
			</div>

			<div
				class="!m-0 transform top-0 right-0 w-1/2 bg-white flex fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 overscroll-contain {openComponent
					? 'translate-x-0'
					: 'translate-x-full'}"
			>
				<svelte:component this={$openComponent.component} {...$openComponent.props} />
			</div>
		{/if}</LoaderIndicator
	>
</div>

<FooterCDB />
