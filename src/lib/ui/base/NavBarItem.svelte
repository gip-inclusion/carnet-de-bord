<script lang="ts">
	import { isCurrentRoute } from '../../../routes/routes';
	import Link from './Link.svelte';
	type MenuItem = {
		name: string;
		label: string;
		path: string;
	};

	export let menuItem: MenuItem;
	export let currentRoute: string;

	$: isCurrent = currentRoute && menuItem.path && isCurrentRoute(currentRoute, menuItem.path);
</script>

<li class="fr-nav__item">
	<Link
		href={menuItem.path}
		classNames={`fr-nav__link ${isCurrent ? 'bf-500' : 'notActive'}`}
		{isCurrent}
	>
		{menuItem.label}
	</Link>
</li>
