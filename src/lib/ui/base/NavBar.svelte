<script lang="ts">
	import { page } from '$app/stores';
	import NavBarItem from './NavBarItem.svelte';
	type MenuItem = {
		name: string;
		label: string;
		path: string;
	};

	export let id: string | null = `header-navigation`;
	export let menuItems: MenuItem[] | null = [];
</script>

<nav class="fr-nav" {id} role="navigation" aria-label="Menu principal">
	<ul class="fr-nav__list">
		{#each menuItems as menuItem (menuItem.name)}
			<NavBarItem {menuItem} currentRoute={$page.path} />
		{/each}
	</ul>
</nav>
