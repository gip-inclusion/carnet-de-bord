<script lang="ts">
	import { connectedUser } from '$lib/stores';
	import type { MenuItem } from '$lib/types';

	import { NavBar } from '$lib/ui/base';
	import { baseUrlForRole } from '$lib/routes';

	export let menuItems: MenuItem[];

	import { openComponent } from '$lib/stores';
	import Disconnect from '$lib/ui/views/Disconnect.svelte';

	function logout() {
		openComponent.open({ component: Disconnect });
	}
</script>

<header class="fr-header">
	<div class="fr-header__body">
		<div class="fr-container">
			<div class="fr-header__body-row">
				<div class="fr-header__brand fr-enlarge-link">
					<div class="fr-header__brand-top">
						<div class="fr-header__logo">
							<p class="fr-logo">
								Ministère<br />du Travail,<br />de l'Emploi<br />et de l'Insertion
							</p>
						</div>
						<div class="fr-header__operator">
							<img
								src="/logo-cdb.svg"
								class="fr-responsive-img"
								style="width:5.4rem;"
								alt=""
								aria-hidden="true"
							/>
						</div>
						<div class="fr-header__navbar">
							<button
								class="fr-btn--menu fr-btn"
								data-fr-opened="false"
								aria-controls="mobile-modal-menu"
								aria-haspopup="menu"
								id="open-modal-menu-button"
								title="Menu"
							>
								Menu
							</button>
						</div>
					</div>
					<div class="fr-header__service">
						<a
							href="/"
							title="Accueil - Carnet de bord - Ministère du Travail, de l'Emploi et de l'Insertion"
						>
							<p class="fr-header__service-title">Carnet de bord</p>
						</a>
						<p class="fr-header__service-tagline">
							Faciliter la vie des personnes en insertion et de leurs accompagnants
						</p>
					</div>
				</div>
				<div class="fr-header__tools">
					<div class="fr-header__tools-links">
						{#if $connectedUser}
							<ul class="fr-btns-group">
								<li>
									<a
										class="fr-btn fr-icon-account-line"
										href={`${baseUrlForRole($connectedUser.role)}/moncompte`}
									>
										Mon compte
									</a>
								</li>
								<li>
									<a
										on:click|preventDefault={logout}
										class="fr-btn fr-icon-logout-box-r-line"
										href="/auth/logout"
									>
										Déconnexion
									</a>
								</li>
							</ul>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
	<div
		class="fr-header__menu fr-modal"
		id="mobile-modal-menu"
		aria-labelledby="open-modal-menu-button"
	>
		<div class="fr-container">
			<button class="fr-btn--close fr-btn" aria-controls="mobile-modal-menu" title="Fermer">
				Fermer
			</button>
			<div class="fr-header__menu-links" />
			{#if $connectedUser}
				<NavBar {menuItems} />
			{/if}
		</div>
	</div>
</header>
<div id="bandeau" />
