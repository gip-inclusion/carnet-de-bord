<script lang="ts">
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';

	import { Link } from '$lib/ui/base';
</script>

<svelte:head>
	<title>Carnet de bord</title>
	<meta
		name="description"
		content="Partager le parcours pour faciliter les avancées des personnes en insertion et de leurs accompagnateurs."
	/>
</svelte:head>

<Header menuItems={[]} />

<div class="fr-container fr-py-6w" style="min-height: calc(100vh - 200px)">
	<div class="flex flex-row items-center gap-16 mr-24">
		<div class="w-4/12">
			<img alt="" aria-hidden="true" src="/images/cdb-landing-illustration-intro.svg" />
		</div>
		<div class="w-8/12">
			<h1>Bienvenue sur Carnet de bord !</h1>
			<p>
				Partager le parcours pour faciliter les avancées des personnes en insertion et de leurs
				accompagnateurs.
			</p>
			<div>
				<Link href="/auth/login" classNames="fr-btn">Accéder à mon compte</Link>
			</div>
		</div>
	</div>
	<div class="flex flex-col gap-4 mx-24 mt-24">
		<h2>Carnet de bord, le suivi partagé des parcours d'insertion</h2>
		<p>
			Porté par le Ministère du Travail, de l’Emploi et de l’Insertion, au sein du programme
			Beta.Gouv, le Carnet de bord est un service public numérique qui a pour objectif de <strong
				>faciliter</strong
			>
			la coordination des échanges entre acteurs et de <strong>simplifier</strong> la lecture des parcours
			d’insertion. Il permet :
		</p>
		<ul>
			<li>
				Aux acteurs de l’insertion d’accéder directement à des informations utiles et à jour pour
				co-construire les parcours avec la personne et faciliter sa mobilisation.
			</li>
			<li>
				Aux publics de bénéficier d’un accompagnement sans rupture d’information grâce à un profil
				partagé
			</li>
		</ul>
		<div class="flex flex-row gap-8 mt-8 pb-16">
			<div class="w-1/3">
				<img class="w-20" src="/images/cdb-landing-icons-1.svg" alt="" aria-hidden="true" />
				<h3 class="fr-h5 !mt-4 !mb-2">Partager l’expertise</h3>
				<div>
					Faciliter les échanges entre les accompagnateurs en partageant les coordonnées des acteurs
					mobilisés.
				</div>
			</div>
			<div class="w-1/3">
				<img class="w-20" src="/images/cdb-landing-icons-2.svg" alt="" aria-hidden="true" />
				<h3 class="fr-h5 !mt-4 !mb-2">Dites-le nous une fois</h3>
				<p>Se concentrer sur l’accompagnement en ayant accès aux éléments clés du parcours.</p>
			</div>
			<div class="w-1/3">
				<img class="w-20" src="/images/cdb-landing-icons-3.svg" alt="" aria-hidden="true" />
				<h3 class="fr-h5 !mt-4 !mb-2">Gagner du temps</h3>
				<div>
					Réduire la durée des parcours des personnes grâce à un passage de relais plus efficace
					entre accompagnateurs.
				</div>
			</div>
		</div>
	</div>
</div>
<div class="bg-france-blue-100">
	<div class="fr-container">
		<div class="flex flex-col mx-24 pt-24 pb-20 text-center">
			<h2>Embarquez à bord !</h2>
			<p>
				Le Carnet de bord pourrait être utile pour les agents de votre institution ?<br />
				Nous sommes à votre écoute pour identifier comment le service pourrait être déployé avec eux.
			</p>
			<div>
				<Link
					classNames="fr-btn"
					href="https://docs.google.com/forms/d/e/1FAIpQLSc035Uma5dJYWnim8q1g97C03b19O7nusr5QBXVEeQnvTS3og/viewform"
				>
					Demander une démo
				</Link>
			</div>
		</div>
	</div>
</div>
<div class="fr-container">
	<div class="flex flex-row items-center gap-16 mx-24">
		<div class="w-7/12">
			<h1>Actualités</h1>
			<p>
				Envie d’en savoir plus ? Découvrez les avancées du projet et participez à sa co-construction
				sur le Forum de l’Inclusion !
			</p>
			<div>
				<Link href="https://communaute.inclusion.beta.gouv.fr/" classNames="fr-btn"
					>Voir l'actualité de la communauté</Link
				>
				<!--<div bind:this={node} />-->
			</div>
		</div>
		<div class="w-5/12 -mb-8">
			<img alt="" aria-hidden="true" src="/images/cdb-landing-illustration-actualites.svg" />
		</div>
	</div>
</div>

<Footer />

<style>
	:global(.align-text-top
			.font-normal
			.grid
			.grid-cols-3
			.leading-10
			.odd:bg-gray-100
			.p-4
			.pl-2
			.pr-4
			.pr-8
			.pt-10
			.pt-4
			.py-3
			.py-8
			.rounded-lg
			.shadow-dsfr) {
	}
</style>
