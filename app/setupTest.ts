// setupTest.ts
/* eslint-disable @typescript-eslint/no-empty-function */
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';
import type { Cookies, Navigation, Page } from '@sveltejs/kit';
import { readable } from 'svelte/store';
import type * as environment from '$app/environment';
import type * as navigation from '$app/navigation';
import type * as stores from '$app/stores';

// Add custom jest matchers
expect.extend(matchers);

// Mock SvelteKit runtime module $app/environment
vi.mock('$app/environment', (): typeof environment => ({
	browser: false,
	dev: true,
	building: false,
	version: 'mocked-version',
}));

// Mock SvelteKit runtime module $app/navigation
vi.mock('$app/navigation', (): typeof navigation => ({
	afterNavigate: () => {},
	beforeNavigate: () => {},
	disableScrollHandling: () => {},
	goto: () => Promise.resolve(),
	invalidate: () => Promise.resolve(),
	invalidateAll: () => Promise.resolve(),
	preloadData: () => Promise.resolve(),
	preloadCode: () => Promise.resolve(),
}));

// Mock SvelteKit runtime module $app/stores
vi.mock('$app/stores', (): typeof stores => {
	const getStores: typeof stores.getStores = () => {
		const navigating = readable<Navigation | null>(null);
		const page = readable<Page>({
			url: new URL('http://localhost'),
			params: {},
			route: null,
			status: 200,
			error: null,
			data: {},
			form: {},
		});
		const updated = { subscribe: readable(false).subscribe, check: async () => false };

		return { navigating, page, updated };
	};

	const page: typeof stores.page = {
		subscribe(fn) {
			return getStores().page.subscribe(fn);
		},
	};
	const navigating: typeof stores.navigating = {
		subscribe(fn) {
			return getStores().navigating.subscribe(fn);
		},
	};
	const updated: typeof stores.updated = {
		subscribe(fn) {
			return getStores().updated.subscribe(fn);
		},
		check: async () => false,
	};

	return {
		getStores,
		navigating,
		page,
		updated,
	};
});

vi.mock('$env/dynamic/public', () => ({ env: {} }));

class FakeCookie implements Cookies {
	set() {
		return;
	}
	get() {
		return 'a';
	}
	getAll() {
		return [];
	}
	delete() {
		return;
	}
	serialize() {
		return '';
	}
}

export function createFakeRequestEvent(method: string, requestHeaders, body: object | null) {
	const headers = new Headers(requestHeaders);
	headers.set('content-type', 'application/json');
	const request = new Request('http://localhost/api/notebooks', {
		headers,
		method,
		body: body ? JSON.stringify(body) : null,
	});
	const cookies = new FakeCookie();
	return {
		request,
		cookies,
		fetch,
		getClientAddress: vi.fn(),
		setHeaders: vi.fn(),
		locals: {},
		params: {},
		platform: undefined,
		route: { id: '/api/notebooks' as const },
		isDataRequest: false,
		url: new URL('http://localhost/endpointUrl'),
	};
}

export function createFetchResponse(status, data) {
	return {
		status,
		text: () => new Promise((resolve) => resolve(JSON.stringify(data))),
		json: () => new Promise((resolve) => resolve(data)),
	};
}
