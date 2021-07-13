<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { post } from '$lib/utils';

	let email = '';
	let password = '';
	let errors = null;

	async function submit() {
		const response = await post(`/auth/login`, { email, password });

		if (response.user) {
			$session.user = response.user;
			goto('/');
		}
	}
</script>

<svelte:head>
	<title>Sign in • Conduit</title>
</svelte:head>

<div>
	<div>
		<div>
			<div>
				<h1>Sign In</h1>
				<p>
					<a href="/register">Need an account?</a>
				</p>

				<form on:submit|preventDefault={submit}>
					<fieldset>
						<input type="email" required placeholder="Email" bind:value={email} />
					</fieldset>
					<fieldset>
						<input type="password" required placeholder="Password" bind:value={password} />
					</fieldset>
					<button type="submit"> Sign in </button>
				</form>
			</div>
		</div>
	</div>
</div>
