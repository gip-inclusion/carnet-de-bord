const colors = require('tailwindcss/colors');

const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {},
		fontFamily: {
			sans: ['Marianne']
		},
		colors: {
			black: colors.black,
			white: colors.white,
			orange: colors.orange,
			blue: colors.blue,
			gray: colors.gray,
			action: '#000638',
			accent: '#6A20AE',
			back1: '#DEDBEE',
			back2: '#F1F5F6',
			error: '#ED4737'
		}
	},
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]
};

module.exports = config;
