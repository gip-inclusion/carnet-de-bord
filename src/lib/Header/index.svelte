<script lang="ts">
	import { page } from '$app/stores';
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
				<a sveltekit:prefetch href="/beneficiaires">Bénéficiaires</a>
			</div>
		</div>
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
