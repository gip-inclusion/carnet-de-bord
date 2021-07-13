<script lang="ts">
	import { page, session } from '$app/stores';

	async function logout() {
		$session.user = null;
	}
</script>

<header>
	<nav>
		<div class="flex space-x-3">
			<div class="py-2 px-8" class:active={$page.path === '/'}>
				<a sveltekit:prefetch href="/">Home</a>
			</div>
			<div class="py-2 px-8" class:active={$page.path === '/about'}>
				<a sveltekit:prefetch href="/about">About</a>
			</div>
			<div class="py-2 px-8" class:active={$page.path === '/beneficiaires'}>
				<a sveltekit:prefetch href="/pro/beneficiaires">Bénéficiaires</a>
			</div>
		</div>
		{#if $session.user}
			<div>
				<div>
					{$session.user.email}
				</div>
				<div>
					<button on:click={logout}>logout</button>
				</div>
			</div>
		{:else}
			<div>
				<a rel="prefetch" href="/login"> Sign in </a>
			</div>
		{/if}
	</nav>

	<div>
		<!-- TODO put something else here? github link? -->
	</div>
</header>

<style lang="postcss">
	.active {
		@apply border-b-2;
	}
</style>
