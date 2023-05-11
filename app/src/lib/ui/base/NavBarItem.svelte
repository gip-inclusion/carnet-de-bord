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
</script>

<li
	class="fr-nav__item"
	on:click={() => {
		$isMenuOpened = false;
	}}
>
	<Link
		href={menuItem.path}
		classNames={`fr-nav__link ${isCurrent ? 'text-vert-cdb' : 'notActive'}`}
		{isCurrent}
	>
		{menuItem.label}
	</Link>
</li>
