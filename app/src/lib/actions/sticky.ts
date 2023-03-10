/**
 * Svelte action that dispatches a custom stuck event when a node becomes stuck or unstuck (position: sticky is having an effect)
 * @param node  - the node the action is placed on
 * @param params.callback - function to execute when the node becomes stuck or unstuck
 */
export function sticky(node, { stickToTop }) {
	const intersectionCallback = function (entries) {
		// only observing one item at a time
		const entry = entries[0];

		let isStuck = false;
		if (!entry.isIntersecting) {
			isStuck = true;
		}

		node.dispatchEvent(
			new CustomEvent('stuck', {
				detail: { isStuck },
			})
		);
	};

	// Seems to be not useful
	// const isValidYPosition = function ({ target, boundingClientRect }) {
	// 	if (target === stickySentinelTop) {
	// 		return boundingClientRect.y < 0;
	// 	} else {
	// 		return boundingClientRect.y > 0;
	// 	}
	// };

	const mutationCallback = function (mutations) {
		// If something changes and the sentinel nodes are no longer first and last child, put them back in position
		mutations.forEach(function () {
			const { parentNode: topParent } = stickySentinelTop;
			const { parentNode: bottomParent } = stickySentinelBottom;

			if (stickySentinelTop !== topParent.firstChild) {
				topParent.prepend(stickySentinelTop);
			}
			if (stickySentinelBottom !== bottomParent.lastChild) {
				bottomParent.append(stickySentinelBottom);
			}
		});
	};
	const intersectionObserver = new IntersectionObserver(intersectionCallback);
	const mutationObserver = new MutationObserver(mutationCallback);

	// we insert and observe a sentinel node immediately after the target
	// when it is visible, the target node cannot be sticking
	const sentinelStyle = 'position: absolute; height: 1px;';
	const stickySentinelTop = document.createElement('div');
	stickySentinelTop.classList.add('stickySentinelTop');
	// without setting a height, Safari breaks
	stickySentinelTop.setAttribute('style', sentinelStyle);
	node.parentNode.prepend(stickySentinelTop);

	const stickySentinelBottom = document.createElement('div');
	stickySentinelBottom.classList.add('stickySentinelBottom');
	stickySentinelBottom.setAttribute('style', sentinelStyle);
	node.parentNode.append(stickySentinelBottom);

	if (stickToTop) {
		intersectionObserver.observe(stickySentinelTop);
	} else {
		intersectionObserver.observe(stickySentinelBottom);
	}

	mutationObserver.observe(node.parentNode, { childList: true });

	return {
		update({ stickToTop }) {
			// change which sentinel we are observing
			if (stickToTop) {
				intersectionObserver.unobserve(stickySentinelBottom);
				intersectionObserver.observe(stickySentinelTop);
			} else {
				intersectionObserver.unobserve(stickySentinelTop);
				intersectionObserver.observe(stickySentinelBottom);
			}
		},

		destroy() {
			intersectionObserver.disconnect();
			mutationObserver.disconnect();
		},
	};
}
