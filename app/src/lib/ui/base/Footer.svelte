<script lang="ts">
	import { Link } from '$lib/ui/base';
	export let landing: string | null = '/';
	const appVersion = __version__;

	function openCookiePanel(event) {
		event.preventDefault();
		window.tarteaucitron.userInterface.openPanel();
	}
</script>

<footer class="fr-footer mt-8" id="footer">
	<div class="fr-container">
		<div class="fr-footer__body">
			<div class="fr-footer__brand fr-enlarge-link">
				<Link href={landing} title="Retour à l’accueil">
					<p class="fr-logo" title="république française">
						République<br />Française
					</p>
				</Link>
			</div>
			<div class="fr-footer__content">
				<p class="fr-footer__content-desc"><slot name="description" /></p>
				<ul class="fr-footer__content-list">
					<li class="fr-footer__content-item">
						<a class="fr-footer__content-link" href="https://legifrance.gouv.fr"
							>legifrance.gouv.fr</a
						>
					</li>
					<li class="fr-footer__content-item">
						<a class="fr-footer__content-link" href="https://gouvernement.fr">gouvernement.fr</a>
					</li>
					<li class="fr-footer__content-item">
						<a class="fr-footer__content-link" href="https://service-public.fr">service-public.fr</a
						>
					</li>
					<li class="fr-footer__content-item">
						<a class="fr-footer__content-link" href="https://data.gouv.fr">data.gouv.fr</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="fr-footer__bottom">
			<ul class="fr-footer__bottom-list">
				<li class="fr-footer__bottom-item">
					<a
						class="fr-footer__bottom-link"
						href="https://github.com/gip-inclusion/carnet-de-bord/blob/main/CHANGELOG.md"
						target="_blank"
						rel="noreferrer"
					>
						Version {appVersion}
					</a>
				</li>
				<li class="fr-footer__bottom-item">
					<!-- svelte-ignore a11y-missing-attribute -->
					<a class="fr-footer__bottom-link">Plan du site</a>
				</li>
				<li class="fr-footer__bottom-item">
					<!-- svelte-ignore a11y-missing-attribute -->
					<a class="fr-footer__bottom-link">Accessibilité : non conforme</a>
				</li>
				<li class="fr-footer__bottom-item">
					<a class="fr-footer__bottom-link" href="/mentions-legales">Mentions légales</a>
				</li>
				<li class="fr-footer__bottom-item">
					<a class="fr-footer__bottom-link" href="/politique-confidentialite">
						Politique de confidentialité
					</a>
				</li>
				<li class="fr-footer__bottom-item">
					<a class="fr-footer__bottom-link" href="/cgu"> CGU </a>
				</li>
				<li class="fr-footer__bottom-item">
					<button class="fr-footer__bottom-link" on:click={openCookiePanel}
						>Gestion des cookies</button
					>
				</li>
			</ul>
			<div class="fr-footer__bottom-copy">
				<p>
					Sauf mention contraire, tous les textes de ce site sont sous <a
						href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
						target="_blank"
						rel="noreferrer">licence etalab-2.0</a
					>
				</p>
			</div>
		</div>
	</div>
</footer>
