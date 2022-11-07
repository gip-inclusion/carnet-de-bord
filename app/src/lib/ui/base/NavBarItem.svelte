<script lang="ts">
	import { isCurrentRoute } from '$lib/routes';
	import { isMenuOpened } from '$lib/stores';
	import Link from './Link.svelte';
	type MenuItem = {
		id: string;
		label: string;
		path: string;
	};

	export let menuItem: MenuItem;
	export let currentRoute: string;

	$: isCurrent = currentRoute && menuItem.path && isCurrentRoute(currentRoute, menuItem.path);

	function hideMenu() {
		$isMenuOpened = false;
	}
</script>

<li class="fr-nav__item" on:click={hideMenu} on:keydown={hideMenu}>
	<Link
		href={menuItem.path}
		classNames={`fr-nav__link ${isCurrent ? 'text-france-blue' : 'notActive'}`}
		{isCurrent}
	>
		{menuItem.label}
	</Link>
</li>
