<script lang="ts">
	import type { PageData } from './$types';
	import Markdown from '@magidoc/plugin-svelte-marked';
	export let data: PageData;
</script>

<div class=" fr-py-6w fr-px-2w">
	<h1>Journal des modifications</h1>
	<Markdown source={data.changelogContent} />
</div>
