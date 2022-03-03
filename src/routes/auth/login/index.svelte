<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Input, Link } from '$lib/ui/base';
	import { post } from '$lib/utils/post';
	import type { RequestStep } from '$lib/types';

	let request: RequestStep = 'start';
	let username = '';

	let magicLink = '';

	async function registration() {
		goto('/inscription');
	}

	async function handleSubmit() {
		request = 'loading';
		const response = await post('/auth/loginCheck', { username });
		if (response.status === 200) {
			const { accessUrl } = await response.json();
			magicLink = accessUrl;
			request = 'success';
		} else {
			request = 'error';
			magicLink = '';
		}
	}
</script>

<svelte:head>
	<title>Connexion - Carnet de bord</title>
</svelte:head>

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
					error={request === 'error'
						? "Une erreur inconnue s'est produite, veuillez réessayer ou nous contacter"
						: ''}
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
			<div>
				Si le compte existe, un lien vous a été envoyé pour vous connecter au Carnet de bord.
			</div>
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
