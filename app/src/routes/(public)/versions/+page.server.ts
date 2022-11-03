import fs from 'fs';

const changelogContent = fs.readFileSync('../CHANGELOG.md', { encoding: 'utf-8' });
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { changelogContent };
};
