<script context="module" lang="ts">
	import { session } from '$app/stores';
	import type { MenuItem } from '$lib/types';

	import { Header, MenuButton, MenuListItem, NavBar } from '$lib/ui/base';
</script>

<script lang="ts">
	import { baseUrlForRole } from '$lib/routes';

	export let menuItems: MenuItem[];

	import { openComponent } from '$lib/stores';
	import Disconnect from './views/Disconnect.svelte';

	function logout() {
		openComponent.open({ component: Disconnect });
	}
</script>

<Header
	siteName="Carnet de bord"
	baseline="Faciliter la vie des personnes en insertion et de leurs accompagnants"
>
	<li slot="quickAccessRight">
		{#if $session.user}
			<MenuButton label="Mon compte" icon="fr-fi-account-line">
				{#if ['manager', 'particulier', 'professional', 'admin_structure'].includes($session.user.role)}
					<MenuListItem href={`${baseUrlForRole($session.user.role)}/moncompte`}>
						Mon Compte
					</MenuListItem>
				{/if}
				<MenuListItem on:select={logout}>Déconnexion</MenuListItem>
			</MenuButton>
		{/if}
	</li>
	<div slot="navbar">
		{#if $session.user}
			<NavBar {menuItems} />
		{/if}
	</div>
</Header>
