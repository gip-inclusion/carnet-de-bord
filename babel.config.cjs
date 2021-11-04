module.exports = {
	env: {
		test: {
			presets: ['@babel/preset-typescript'],
		},
	},
	presets: [
		'@babel/preset-typescript',
		'babel-preset-vite',
		[
			'@babel/preset-env',
			{
				targets: {
					node: 'current',
				},
			},
		],
	],
};
