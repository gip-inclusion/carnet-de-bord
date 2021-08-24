<script context="module" lang="ts">
	import { session } from '$app/stores';
	import { orgName } from '$lib/constants';

	import type { MenuItem } from '$lib/ui/base/types';
	import { Header, NavBar, Link } from '$lib/ui/base';
</script>

<script lang="ts">
	import Button from './base/Button.svelte';
	import { post } from '$lib/utils/post';
	import { goto } from '$app/navigation';
	import { baseUrlForRole } from '$lib/routes';

	export let menuItems: MenuItem[];

	async function logout() {
		await post(`/auth/logout`, {});
		$session.user = null;
		goto('/');
	}
</script>

<Header siteName="Carnet de bord" baseline="Précisions sur l'organisation">
	<span slot="org">{@html orgName}</span>
	<span slot="quickAccessRight">
		{#if $session.user}
			<div class="flex flex-row gap-2 align-items-center">
				<Link href={`${baseUrlForRole($session.user.role)}/moncompte`}>
					<span class="bf-500 fr-fi-account-line" aria-hidden="true" />
				</Link>
				<Button classNames="self-center" outline={true} on:click={logout}>Déconnexion</Button>
			</div>
		{/if}
	</span>
	<span slot="navbar">
		{#if $session.user}
			<NavBar {menuItems} />
		{/if}
	</span>
</Header>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}
</style>
