<script context="module" lang="ts">
	import '../app.postcss';
	import 'remixicon/fonts/remixicon.css';
	import { GRAPHQL_API_URL } from '$lib/config/env';
	import { createClient, setClient } from '@urql/svelte';

	function getToken(session) {
		return session.token;
	}

	export async function load({ page, fetch, session }) {
		if (!session.user && !page.path.startsWith('/auth')) {
			return {
				status: 302,
				redirect: '/auth/login'
			};
		}
		if (session.user && page.path.startsWith('/auth')) {
			return {
				status: 302,
				redirect: '/'
			};
		}

		const client = createClient({
			url: GRAPHQL_API_URL,
			fetch,
			fetchOptions: () => {
				const token = getToken(session);
				if (token) {
					return {
						headers: { authorization: token ? `Bearer ${token}` : '' }
					};
				}
				return {};
			}
		});

		return {
			props: { client }
		};
	}
</script>

<script lang="ts">
	import { session } from '$app/stores';
	import { post } from '$lib/utils/post';
	import { goto } from '$app/navigation';

	async function logout() {
		await post(`/auth/logout`, {});
		$session.user = null;
		goto('/');
	}

	export let client;
	setClient(client);
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
			<button
				class="block p-2 px-4 border rounded text-action bg-back2 hover:bg-accent"
				on:click|preventDefault={logout}>Deconnexion</button
			>
		{/if}
	</div>
</header>

<div class="px-40 py-2">
	<slot />
</div>
