<script context="module" lang="ts">
	import { session } from '$app/stores';
	import { orgName } from '$lib/constants';

	import type { MenuItem } from '$lib/ui/base/types';
	import { Header, NavBar, Link } from '$lib/ui/base';
</script>

<script lang="ts">
	export let menuItems: MenuItem[];
</script>

<Header siteName="Carnet de bord" baseline="Précisions sur l'organisation">
	<span slot="org">{@html orgName}</span>
	<span slot="quickAccessRight">
		{#if $session.user}
			<Link href="/pro/moncompte">
				<span class="bf-500 fr-fi-account-line" aria-hidden="true" />
			</Link>
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
