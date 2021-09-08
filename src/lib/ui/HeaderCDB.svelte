<script context="module" lang="ts">
	import { session } from '$app/stores';
	import { orgName } from '$lib/constants';
	import type { MenuItem } from '$lib/ui/base/types';

	import { Header, NavBar } from '$lib/ui/base';
</script>

<script lang="ts">
	import { baseUrlForRole } from '$lib/routes';

	import MenuButton from './base/MenuButton.svelte';
	import MenuListItem from './base/MenuListItem.svelte';

	export let menuItems: MenuItem[];

	import { openComponent } from '$lib/stores';
	import Disconnect from './views/Disconnect.svelte';

	function logout() {
		openComponent.set(Disconnect);
	}
</script>

<Header siteName="Carnet de bord" baseline="Précisions sur l'organisation">
	<div slot="org">{@html orgName}</div>
	<div slot="quickAccessRight">
		{#if $session.user}
			<MenuButton>
				<MenuListItem href={`${baseUrlForRole($session.user.role)}/moncompte`}
					>Mon Compte</MenuListItem
				>
				<MenuListItem on:select={logout}>Déconnexion</MenuListItem>
			</MenuButton>
		{/if}
	</div>
	<div slot="navbar">
		{#if $session.user}
			<NavBar {menuItems} />
		{/if}
	</div>
</Header>
