<script context="module" lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { Button, Header, NavBar } from '$lib/ui/base';
	import { getGraphqlAPI } from '$lib/config/variables/public';
	import { post } from '$lib/utils/post';
	import { createClient, setClient, Client } from '@urql/svelte';

	import 'remixicon/fonts/remixicon.css';
	import '@gouvfr/dsfr/dist/css/dsfr.min.css';
	import '../app.postcss';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	function getToken(session: { token?: string }) {
		return session.token;
	}

	export async function load({ page, fetch, session }: LoadInput): Promise<LoadOutput> {
		const graphqlAPI = session.graphqlAPI ? session.graphqlAPI : getGraphqlAPI();
		if (page.path === '/healthz') {
			return {};
		}
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
			url: graphqlAPI,
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
	async function logout() {
		await post(`/auth/logout`, {});
		$session.user = null;
		goto('/');
	}

	export let client: Client;
	setClient(client);

	const menuItems = [
		{ id: 'accueil', name: 'accueil', path: '/pro/accueil', label: 'Accueil' },
		{ id: 'annuaire', name: 'annuaire', path: '/pro/annuaire', label: 'Annuaire des bénéficiaires' }
	];

	const org = "Ministère<br />du Travail,<br />de l'Emploi<br />et de l'Insertion";
</script>

<Header siteName="Carnet de bord" baseline="Précisions sur l'organisation">
	<span slot="org">{@html org}</span>
	<span slot="quickAccessRight">
		{#if $session.user}
			<Button outline={true} on:click={logout}>Déconnexion</Button>
		{/if}
	</span>
	<span slot="navbar">
		<NavBar {menuItems} />
	</span>
</Header>

<div style="min-height: calc(100vh - 200px)">
	<slot />
</div>
