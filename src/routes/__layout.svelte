<script>
	import Header from '$lib/Header/index.svelte';
	import '../app.postcss';
</script>

<header>
	<div>
		<a href="/" class="">
			<img
				class="inline"
				src="/logo-ministere.png"
				alt="Accueil Ministère du Travail, de l'Emploi et de l'Insertion"
				width="98"
				height="89"
			/>
		</a>
		<Header />
		<div class="inline text-4xl font-bold text-blue-dora">Carnet de bord</div>
	</div>
</header>

<slot />
