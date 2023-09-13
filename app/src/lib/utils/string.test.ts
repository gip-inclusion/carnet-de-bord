import { expect } from 'vitest';
import { capitalize } from './string';

describe('string capitalize', () => {
	it.each([null, undefined, '', '    '])('does nothing for blank strings, %s', (blank) => {
		expect(capitalize(blank)).toEqual(blank);
	});
	it('puts the first letter in upper case', () => {
		expect(capitalize('test')).toEqual('Test');
	});
	it('works the same for single letters', () => {
		expect(capitalize('a')).toEqual('A');
	});
	it('puts other letters in lowercase', () => {
		expect(capitalize('aBCDeF')).toEqual('Abcdef');
	});
});
