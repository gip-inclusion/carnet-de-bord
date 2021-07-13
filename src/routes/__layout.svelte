<script context="module" lang="ts">
	import { authGuard } from '$lib/guards';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import '../app.postcss';

	export async function load({ page, fetch, session, context }: LoadInput): Promise<LoadOutput> {
		return await authGuard({ page, fetch, session, context });
	}
</script>

<script lang="ts">
	import { session } from '$app/stores';
</script>

<header class="shadow-md">
	<div class="flex flex-row items-center px-8 py-2">
		<a class="block" href="/">
			<img
				class="inline"
				src="/logo-ministere.png"
				alt="Accueil Ministère du Travail, de l'Emploi et de l'Insertion"
				width="107"
				height="86"
			/>
		</a>
		<div class="flex-grow" />
		{#if $session.user}
			<a
				class="block p-2 px-4 border rounded text-action bg-back2 hover:border-accent"
				href="/logout">Deconnexion</a
			>
		{:else}
			<a class="block p-2 px-4 text-white rounded bg-action hover:bg-accent" href="/login"
				>Se connecter</a
			>
		{/if}
	</div>
</header>

<div class="px-8 py-2">
	<slot />
</div>
