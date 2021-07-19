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
	import { post } from '$lib/utils';
	import { goto } from '$app/navigation';

	async function logout() {
		await post(`/api/auth/logout`, {});
		$session.user = null;
		goto('/');
	}
</script>

<header class="shadow-md px-40">
	<div class="flex flex-row items-center py-2">
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
				class="block p-2 px-4 border rounded text-action bg-back2 hover:bg-accent"
				href="/logout"
				on:click|preventDefault={logout}>Deconnexion</a
			>
		{/if}
	</div>
</header>

<div class="px-40 py-2">
	<slot />
</div>
