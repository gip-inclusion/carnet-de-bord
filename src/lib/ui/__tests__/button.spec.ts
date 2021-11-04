/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import ButtonSpec from './Button.svelte';

/**
 * An example test suite outlining the usage of
 * `describe()`, `beforeEach()`, `test()` and `expect()`
 *
 * @see https://jestjs.io/docs/getting-started
 * @see https://github.com/testing-library/jest-dom
 */

describe('Button', () => {
	it('it should render', async () => {
		const { getByText } = render(ButtonSpec);

		expect(getByText('Hello Button')).toBeVisible();
	});
});
