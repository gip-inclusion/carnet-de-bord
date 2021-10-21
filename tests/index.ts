import * as cd51 from './parser/cd51.test.js';

Object.values(cd51).forEach(async (test) => await test());

export {};
