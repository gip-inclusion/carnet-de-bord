<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ url }) => {
		const alert = url.searchParams.get('reason') ?? null;
		return {
			props: {
				alert,
			},
		};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { Alert, Button, Input, Link } from '$lib/ui/base';
	import { post } from '$lib/utils/post';
	import type { RequestStep } from '$lib/types';

	export let alert: string | null = null;
	let request: RequestStep = 'start';
	let username = '';

	let magicLink = '';

	async function registration() {
		goto('/inscription');
	}

	async function handleSubmit() {
		request = 'loading';
		const response = await post('/auth/login', { username });
		if (response.status === 401) {
			request = 'error';
		}
		if (response.status === 200) {
			const { accessUrl } = await response.json();
			magicLink = accessUrl;
			request = 'success';
		} else {
			magicLink = '';
		}
	}
</script>

<svelte:head>
	<title>Connexion - Carnet de bord</title>
</svelte:head>

{#if alert === 'expired'}
	<Alert type="info">Votre session a expiré, veuillez vous reconnecter.</Alert>
{/if}

{#if request !== 'success'}
	<h1>
		<div>Se connecter</div>
		<div>au Carnet de bord</div>
	</h1>
	<form class="flex w-full flex-col space-y-6" on:submit|preventDefault={handleSubmit}>
		<div>Veuillez saisir votre adresse de courriel pour recevoir votre lien de connexion.</div>
		<div class="flex w-full flex-col gap-8">
			<div class="flex w-full flex-col gap-4">
				<Input
					class="!mb-0"
					bind:value={username}
					inputLabel="Courriel"
					placeholder="nour@social.gouv.fr"
					error={request === 'error' ? "Ce courriel n'est pas rattaché à un compte existant" : ''}
					required={true}
				/>
				<div>
					<Button type="submit" disabled={!username || request === 'loading'}>
						{#if request === 'loading'}
							<span class="ri ri-refresh-line" /> Connexion...
						{:else}
							Se connecter
						{/if}
					</Button>
				</div>
			</div>
			<div class="flex flex-col gap-4">
				<div class="text-sm font-bold">Vous n’êtes pas encore inscrit ?</div>
				<div>
					<Button outline={true} on:click={registration}>Je m'inscris</Button>
				</div>
			</div>
		</div>
	</form>
{:else}
	<div class="flex w-full flex-col gap-16">
		<div class="flex w-full flex-col gap-6">
			<h1 style="margin-bottom: 0;">
				<div>Connectez-vous</div>
				<div>au Carnet de bord</div>
			</h1>
			<div>Un lien vous a été envoyé pour vous connecter au Carnet de bord.</div>
			<!-- @TODO what is this button supposed to do?
					<div>
						<Button>J'ai compris</Button>
					</div>
					-->
			{#if magicLink}
				<div><Link href={magicLink}>Ouvrir Carnet de bord</Link></div>
			{/if}
		</div>
		<div class="flex flex-col gap-6">
			<div class="text-sm">
				Si vous n'avez pas reçu le lien, vous pouvez cliquer sur le bouton ci-dessous.
			</div>
			<div>
				<Button outline={true}>Renvoyer le lien</Button>
			</div>
		</div>
	</div>
{/if}
