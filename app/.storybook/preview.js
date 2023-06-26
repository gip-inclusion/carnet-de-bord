import './storybook.css';

// You can import any other JS/CSS your app needs here:
import '../src/app.css';

import '@gouvfr/dsfr/dist/dsfr/dsfr.module.min.js';

export const parameters = {
	layout: 'centered',
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		hideNoControlsWarning: true,
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};
