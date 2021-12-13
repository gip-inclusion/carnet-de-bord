<script lang="ts">
	import { session } from '$app/stores';
	import { baseUrlForRole } from '$lib/routes';

	import { openComponent } from '$lib/stores';
	import { Link } from '.';
	import Disconnect from '$lib/ui/views/Disconnect.svelte';

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
	let modalEl: HTMLDivElement;
	function closeDsfrModal() {
		if (!modalEl) {
			return;
		}
		window.dsfr(modalEl).modal.conceal();
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
								<ul class="fr-links-group">
									<slot name="quickAccessLeft" />
									<slot name="quickAccessMiddle" />
									<slot name="quickAccessRight" />
								</ul>
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
		id="modal-menu"
		bind:this={modalEl}
		aria-labelledby="fr-btn-menu-mobile"
	>
		<!-- hack: @lionelb: manually close modal since it's not handle by dsfr component in a spa context    -->
		<div class="fr-container" on:click={closeDsfrModal}>
			<button class="fr-link--close fr-link" aria-controls="modal-menu">Fermer</button>
			<!-- hack:@lionelb: double `.fr-header__menu-links` so dsfr menu will copy the dropdown button in this first div and allow us to customize links for mobile menu links -->
			<div class="fr-header__menu-links hidden" />
			<div class="fr-header__menu-links">
				{#if $session.user}
					<ul class="fr-links-group">
						{#if ['professional', 'particulier'].includes($session.user.role)}
							<li>
								<Link classNames="fr-link" href={`${baseUrlForRole($session.user.role)}/moncompte`}
									>Mon Compte</Link
								>
							</li>
						{/if}
						<li><button class="fr-link" on:click={logout}>Déconnexion</button></li>
					</ul>
				{/if}
			</div>
			<slot name="navbar" />
		</div>
	</div>
</header>
