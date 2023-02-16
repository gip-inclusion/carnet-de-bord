<script lang="ts">
	import EditDiagnostic from '$lib/ui/Diagnostic/EditDiagnostic.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<EditDiagnostic notebookId={data.notebookId} />
