import { parse } from './index';
import { test, expect } from '@jest/globals';

test('parser', () => {
	expect(parse()).toBe(42);
});
