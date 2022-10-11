<script context="module" lang="ts">
	throw new Error(
		'@migration task: Check code was safely removed (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292722)'
	);

	// import type { JwtPayload } from '$lib/utils/getJwt';
	// import type { LoadEvent, LoadOutput } from '@sveltejs/kit';
	// export async function load({ url, params }: LoadEvent): Promise<LoadOutput> {
	// 	const accessKey = params.uuid;
	// 	const u = url.searchParams.get('url');
	// 	return {
	// 		props: {
	// 			accessKey,
	// 			url: u,
	// 		},
	// 	};
	// }
</script>

<script lang="ts">
	throw new Error(
		'@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)'
	);

	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import jwtDecode from 'jwt-decode';
	import { session } from '$app/stores';
	import * as Matomo from '$lib/tracking/matomo';
	import { homeForRole } from '$lib/routes';

	export let accessKey: string;
	export let url: string;
	export let displayError = false;

	onMount(async () => {
		const response: Response = await fetch(`/auth/jwt`, {
			method: 'POST',
			headers: {
				Accept: 'application/json; version=1.0',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				accessKey,
			}),
		});
		if (response.ok) {
			const { jwt } = await response.json();
			const user = jwtDecode<JwtPayload>(jwt);
			$session.user = user;
			$session.token = jwt;
			Matomo.setCustomDimension(Matomo.CustomDimensions.Role, $session.user.role);
			if ($session.user.deploymentId) {
				Matomo.setCustomDimension(Matomo.CustomDimensions.Deployment, $session.user.deploymentId);
			}
			goto(url ? url : homeForRole($session.user.role));
		} else {
			displayError = true;
		}
	});
</script>

<svelte:head>
	<title>Validation du token de connexion - Carnet de bord</title>
</svelte:head>
{#if displayError}
	<div class="pt-28 flex flex-col justify-items-center">
		<div class="pb-12 text-xl text-center">Désolé, ce lien n'est plus valide...</div>
		<a
			class="p-2 px-4 border-2 text-center border-accent text-accent rounded hover:bg-accent hover:text-white"
			href="/auth/login"
		>
			Accéder à la page de connexion
		</a>
	</div>
{/if}
