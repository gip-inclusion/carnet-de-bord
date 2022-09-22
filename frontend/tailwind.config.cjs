const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {},
		// colors taken from https://github.com/betagouv/dora-front/blob/db82eb88f6aff6dcd59b157843e43054a0b7c6d6/tailwind.config.cjs
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			gray: {
				100: '#F5F5F5',
				200: '#E0E0E0',
				300: '#D5D5D5',
				'03': '#CCCCCC',
				text: { DEFAULT: '#555555', alt: '#999999', alt2: '#777777' },
				dark: '#2E2E2E',
				bg: '#F8F8F8',
			},
			'france-blue': { DEFAULT: '#000091', 100: '#F2F2F9', 500: '#000091' },
			white: '#FFFFFF',
			black: '#000000',
			'marianne-red': '#E1000F',
			magenta: {
				80: '#AF8EF3',
				60: '#C3AAF6',
				40: '#D7C6F9',
				20: '#EBE3FB',
				10: '#F5F0FD',
			},
			success: '#008941',
			information: { DEFAULT: '#0762C8', bg: '#DBF0FF', light: '#F0F8FF' },
			action: '#000638',
			accent: '#6A20AE',
			error: '#ED4737',
		},
		fontFamily: {
			sans: ['Marianne'],
		},
	},
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
	important: true,
};

module.exports = config;
