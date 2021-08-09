<script lang="ts">
	import { Breadcrumbs, Footer } from '$lib/ui/base';
	import { page } from '$app/stores';
	import { getSegments } from '../../routes/routes';

	$: segments = getSegments($page.path);

	const org = "Ministère<br />du Travail,<br />de l'Emploi<br />et de l'Insertion";
</script>

<div class="px-40">
	<Breadcrumbs {segments} />
</div>
<div style="min-height: calc(100vh - 200px)">
	<slot />
</div>

<Footer>
	<span slot="org">{@html org}</span>
</Footer>
