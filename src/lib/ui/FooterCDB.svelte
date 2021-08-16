<script lang="ts">
	import { orgName } from '$lib/constants';
	import { Footer } from '$lib/ui/base';
</script>

<Footer>
	<span slot="org">{@html orgName}</span>
</Footer>
