<script context="module" lang="ts">
	import { GRAPHQL_API_URL } from '$lib/variables';
	import { createClient, setClient } from '@urql/svelte';

	export async function load({ page, fetch, context }) {
		const client = createClient({
			url: GRAPHQL_API_URL,
			fetch,
			fetchOptions: () => {
				const token =
					'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsicHJvZmVzc2lvbmFsIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InByb2Zlc3Npb25hbCIsIngtaGFzdXJhLXVzZXItaWQiOiIxNzQzNDQ2NC01ZjY5LTQwY2MtODE3Mi00MDE2MDk1OGEzM2QifSwiaWQiOiIxNzQzNDQ2NC01ZjY5LTQwY2MtODE3Mi00MDE2MDk1OGEzM2QiLCJyb2xlIjoicHJvZmVzc2lvbmFsIiwiaWF0IjoxNjI2Nzg5NDA4LCJleHAiOjE2MjkzODE0MDgsInN1YiI6IjE3NDM0NDY0LTVmNjktNDBjYy04MTcyLTQwMTYwOTU4YTMzZCJ9.QNOa0zvS2tDsMIyg5whfdDd_KTY57_eHCpN4NP9D0Iuj34zV_8FF5I6QnzPtbkoT6X58Tgf3PRrTlI8J2FrienCK17_mbwGDGMieednISZ707CViWX-dgEDwBZAg0lyum508ZW-pI-S8XlZdq_3FxB0E5A0gOdVEOgfGDay9RlXpw018FaAdBEalDNkXSqFZqQKF1d4JcnaDVGpBYiDel_H8iq6V5Z75JnHBG5JANlC5vDCbKVZsZ3k7RuoVMZ1i5MgKYgmQQO9RPVQ9GI_eOY_q8qv4HAViRkxuS-BhMdXCeRo5mRZOHoqP58xLPunw9Nq811aH1mjdzdCKoVHvUg';
				return {
					headers: { authorization: token ? `Bearer ${token}` : '' }
				};
			}
		});

		return {
			props: { client }
		};
	}
</script>

<script lang="ts">
	import { session } from '$app/stores';
	import { post } from '$lib/utils';
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
