<script lang="ts">
	import { session } from '$app/stores';
	import { baseUrlForRole } from '$lib/routes';

	import { isMenuOpened, openComponent } from '$lib/stores';
	import { Link } from '.';
	import Disconnect from '../views/Disconnect.svelte';

	/* export let withLogo: boolean | null = false; */
	export let withSearch: boolean | null = false;
	export let enlargeLink: boolean | null = true;
	export let siteName: string | null = '';
	export let baseline: string | null = '';
	export let landing: string | null = '/';

	let showQuickAccess =
		$$slots.quickAccessLeft || $$slots.quickAccessMiddle || $$slots.quickAccessRight;
	let showTools =
		/* withSearch || */
		showQuickAccess;

	function logout() {
		openComponent.open({ component: Disconnect });
	}
</script>

<header role="banner" class="fr-header">
	<div class="fr-header__body">
		<div class="fr-container">
			<div class="fr-header__body-row">
				<div class={`fr-header__brand ${enlargeLink ? 'fr-enlarge-link' : ''}`}>
					<div class="fr-header__brand-top">
						<div class="fr-header__logo">
							<a href={landing} title={`Accueil - ${siteName}`}>
								<p class="fr-logo">
									<slot name="org" />
								</p>
							</a>
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
								aria-controls="modal-menu"
								aria-haspopup="menu"
								title="Menu"
								id="fr-btn-menu-mobile-4"
								on:click={() => {
									$isMenuOpened = true;
								}}
							>
								Menu
							</button>
						</div>
					</div>
					{#if siteName}
						<div class="fr-header__service">
							<a href="/" title={`Accueil - ${siteName}`}>
								<p class="fr-header__service-title">{siteName}</p>
							</a>
							{#if baseline}
								<p class="fr-header__service-tagline">{baseline}</p>
							{/if}
						</div>
					{/if}
				</div>
				{#if showTools}
					<div class="fr-header__tools">
						{#if showQuickAccess}
							<div class="fr-header__tools-links">
								{#if !$isMenuOpened}
									<ul class="fr-links-group">
										<slot name="quickAccessLeft" />
										<slot name="quickAccessMiddle" />
										<slot name="quickAccessRight" />
									</ul>
								{/if}
							</div>
						{/if}
						{#if withSearch}
							<div class="fr-header__search fr-modal" id="modal-866">
								<div class="fr-container fr-container-lg--fluid">
									<button class="fr-link--close fr-link" aria-controls="modal-866">Fermer</button>
									<div class="fr-search-bar" id="search-865" role="search">
										<label class="fr-label" for="search-865-input">Recherche </label>
										<input
											class="fr-input"
											placeholder="Rechercher"
											type="search"
											id="search-865-input"
											name="search-865-input"
										/>
										<button class="fr-btn" title="Rechercher"> Rechercher </button>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div
		class="fr-header__menu fr-modal"
		class:fr-modal--opened={$isMenuOpened}
		id="modal-menu"
		aria-labelledby="fr-btn-menu-mobile"
	>
		<div class="fr-container">
			<button
				class="fr-link--close fr-link"
				aria-controls="modal-menu"
				on:click={() => {
					$isMenuOpened = false;
				}}>Fermer</button
			>
			{#if $isMenuOpened}
				<div class="fr-header__menu-links">
					{#if $session.user}
						<ul class="fr-links-group">
							<li>
								<Link classNames="fr-link" href={`${baseUrlForRole($session.user.role)}/moncompte`}
									>Mon Compte</Link
								>
							</li>
							<li><button class="fr-link" on:click={logout}>Déconnexion</button></li>
						</ul>
					{/if}
				</div>
			{/if}
			<slot name="navbar" />
		</div>
		<!--
	{#if withQuickAccess}
	<div class="fr-header__menu fr-modal" id="modal-870" aria-labelledby="fr-btn-menu-mobile-4">
		<div class="fr-container">
			<button class="fr-link--close fr-link" aria-controls="modal-870">Fermer</button>
			<div class="fr-header__menu-links" />
			<nav class="fr-nav" id="navigation-869" role="navigation" aria-label="Menu principal">
				<ul class="fr-nav__list">
					<li class="fr-nav__item">
						<a class="fr-nav__link" href="#" target="_self">accès direct</a>
					</li>
					<li class="fr-nav__item">
						<a class="fr-nav__link" href="#" target="_self">accès direct</a>
					</li>
					<li class="fr-nav__item">
						<a class="fr-nav__link" href="#" target="_self">accès direct</a>
					</li>
					<li class="fr-nav__item">
						<a class="fr-nav__link" href="#" target="_self">accès direct</a>
					</li>
				</ul>
			</nav>
		</div>
	</div>
	{/if}
	-->
	</div>
</header>
