<script lang="ts">
	import { Link } from '$lib/ui/base';
</script>

<svelte:head>
	<title>Validation du token de connexion - Carnet de bord</title>
</svelte:head>

<div class="pt-28 flex flex-col grow items-center">
	<p class="pb-12 text-xl">Désolé, ce lien n'est plus valide...</p>
	<Link classNames="fr-btn" href="/auth/login">Accéder à la page de connexion</Link>
</div>
