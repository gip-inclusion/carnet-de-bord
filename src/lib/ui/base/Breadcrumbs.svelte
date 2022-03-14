<script context="module" lang="ts">
	import type { Segment } from '$lib/routes';
	let counter = 0;
</script>

<script lang="ts">
	import Link from './Link.svelte';
	counter++;

	export let id: string | null = `breadcrumbs-${counter}`;

	export let segments: Segment[] = [{ name: 'accueil', path: '/', label: 'Accueil' }];
	$: [links, current] = [segments.slice(0, -1), segments.slice(-1)[0]];
</script>

<nav class="fr-breadcrumb" aria-label="Vous êtes ici :">
	<button class="fr-breadcrumb__button" aria-expanded="false" aria-controls={id}
		>Voir le fil d’Ariane</button
	>
	<div class="fr-collapse" {id}>
		<ol class="fr-breadcrumb__list">
			{#each links as segment (segment.name)}
				<li>
					<Link href={segment.path} title={segment.label} classNames="fr-breadcrumb__link"
						>{segment.label}</Link
					>
				</li>
			{/each}
			<li>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="fr-breadcrumb__link" aria-current="page">{current.label}</a>
			</li>
		</ol>
	</div>
</nav>
