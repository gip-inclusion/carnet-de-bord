<script lang="ts">
	import Markdown from '@magidoc/plugin-svelte-marked';
	import fs from 'fs';

	const changelogContent = fs.readFileSync('../CHANGELOG.md', { encoding: 'utf-8' });
</script>

<Markdown source={changelogContent} />
