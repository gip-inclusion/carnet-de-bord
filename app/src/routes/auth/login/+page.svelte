<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Input } from '$lib/ui/base';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let loading = false;

	function submitHandler() {
		loading = true;
		return async ({ update }) => {
			await update();
			loading = false;
		};
	}
</script>

<svelte:head>
	<title>Connexion - Carnet de bord</title>
</svelte:head>

<h1>
	<div>Se connecter</div>
	<div>au Carnet de bord</div>
</h1>
{#if !form?.success}
	<form class="flex w-full flex-col space-y-6" method="POST" use:enhance={submitHandler}>
		<div>Veuillez saisir votre adresse de courriel pour recevoir votre lien de connexion.</div>
		<div class="flex w-full flex-col gap-8">
			<div class="flex w-full flex-col gap-4">
				<Input
					class="!mb-0"
					inputLabel="Courriel"
					placeholder="nour@social.gouv.fr"
					name="username"
					error={form?.message ? form?.message : ''}
					required
					value={form?.username ?? ''}
				/>
				<div>
					<Button type="submit" disabled={loading}>
						{#if loading}
							<span class="ri ri-refresh-line" /> Connexion...
						{:else}
							Se connecter
						{/if}
					</Button>
				</div>
			</div>
		</div>
	</form>
{:else}
	<div class="flex w-full flex-col gap-16">
		<div class="flex w-full flex-col gap-6">
			<div>Un lien vous a été envoyé pour vous connecter au Carnet de bord.</div>
			{#if form?.accessUrl}
				<div><a href={form?.accessUrl}>Ouvrir Carnet de bord</a></div>
			{/if}
		</div>
		<div class="flex flex-col gap-6">
			<div class="text-sm">
				Si vous n'avez pas reçu le lien, vous pouvez cliquer sur le bouton ci-dessous.
			</div>
			<div>
				<!-- le bouton devrait être supprimé mais il permet à l'utilisateur de faire une action pour patienter pendant que le courriel est délivré -->
				<Button outline={true}>Renvoyer le lien</Button>
			</div>
		</div>
	</div>
{/if}
