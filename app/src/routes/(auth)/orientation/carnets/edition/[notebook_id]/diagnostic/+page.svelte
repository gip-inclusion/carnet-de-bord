<script lang="ts">
	import DiagnosticEdit from '$lib/ui/Diagnostic/DiagnosticEdit.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<DiagnosticEdit notebookId={data.notebookId} />
