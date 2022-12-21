import { describe, it } from 'vitest';
import { nullifyEmptyString } from './validation';

describe('nullify empty string', () => {
	it('should return null when string is empty', async () => {
		expect(nullifyEmptyString('')).eq(null);
	});
	it('should return the string when string is not empty', async () => {
		expect(nullifyEmptyString('toto')).eq('toto');
	});
});
