import { parse } from './index';

test('parser', () => {
	expect(parse()).toBe(42);
});
