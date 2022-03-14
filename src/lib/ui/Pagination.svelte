<script lang="ts">
	import { page } from '$app/stores';

	export let pageSize = 20;
	export let count = 0;
	export let currentPage = 0;
	export let nbVisible = 4;

	const TOLERANCE = 2;
	const nbPages = Math.floor(count / pageSize);

	function getPaginationHref(pageIndex: number): string {
		const urlParams = new URLSearchParams([...$page.url.searchParams.entries()]);
		urlParams.set('page', pageIndex.toString());
		return `?${urlParams.toString()}`;
	}
	console.log({ currentPage, count, pageSize });
	let rangeStartIndex = Math.min(
		Math.max(0, currentPage - Math.floor(nbVisible / 2)),
		Math.max(nbPages - nbVisible - 1, 0)
	);

	// prevent "..." from displaying if startRange is too close from the beginn
	if (rangeStartIndex <= TOLERANCE) {
		rangeStartIndex = 0;
	}
	let rangeEndIndex = Math.min(rangeStartIndex + nbVisible, nbPages);

	// prevent "..." from displaying if endRange is too close from the end
	const endRangeNbPageDiff = nbPages - rangeEndIndex;
	if (endRangeNbPageDiff <= TOLERANCE) {
		rangeEndIndex += endRangeNbPageDiff;
	}
	const paginationButtons = [];

	if (rangeStartIndex > TOLERANCE) {
		paginationButtons.push(1, null);
	}

	for (let i = rangeStartIndex; i < rangeEndIndex; i++) {
		paginationButtons.push(i + 1);
	}

	if (nbPages - rangeEndIndex > TOLERANCE) {
		paginationButtons.push(null, nbPages);
	}
</script>

{#if nbPages > 1}
	<nav class="fr-pagination" aria-label="Pagination">
		<ul class="fr-pagination__list">
			<li>
				<a
					class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
					aria-disabled={currentPage === 1}
					href={getPaginationHref(Math.max(currentPage - 1, 1))}
				>
					Page précédente
				</a>
			</li>
			{#each paginationButtons as page}
				{#if page === null}
					<li>
						<span class="fr-pagination__link fr-displayed-lg"> … </span>
					</li>
				{:else}
					<li>
						<a
							class="fr-pagination__link"
							aria-current={page === currentPage ? 'page' : null}
							title={`Page ${page}`}
							href={getPaginationHref(page)}
						>
							{page}
						</a>
					</li>
				{/if}
			{/each}
			<li>
				<a
					class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
					aria-disabled={currentPage === nbPages}
					href={getPaginationHref(Math.min(currentPage + 1, nbPages))}
				>
					Page suivante
				</a>
			</li>
		</ul>
	</nav>
{/if}
