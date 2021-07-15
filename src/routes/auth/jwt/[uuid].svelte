<script context="module" lang="ts">
	export async function load({ page, fetch }) {
		const accessKey = page.params.uuid;
		return {
			props: {
				accessKey
			}
		};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { session } from '$app/stores';
	import { onMount } from 'svelte';

	export let accessKey;
	let errors;

	onMount(async () => {
		const response: any = await fetch(`/api/auth/jwt`, {
			method: 'POST',
			headers: {
				Accept: 'application/json; version=1.0',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				accessKey
			})
		});
		const body = await response.json();
		if (body.user) {
			$session.user = body.user;
			goto('/');
		}
		if (body.errors) {
			errors = body.errors;
		}
	});
</script>

<div class="flex flex-row">{errors}</div>
