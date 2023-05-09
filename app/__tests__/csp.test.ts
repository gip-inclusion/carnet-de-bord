import { expandURLsInCSP } from '$lib/utils/csp';

it('should expand environment variables in the generated CSP', async () => {
	const originalCSP =
		"default-src 'self'; connect-src 'self' %GRAPHQL_API_URL% %PUBLIC_SENTRY_DSN%; style-src 'self'";
	const expandedCSP = expandURLsInCSP(
		originalCSP,
		{ GRAPHQL_API_URL: 'https://graphql.example.org:5000/v1' },
		{ PUBLIC_SENTRY_DSN: 'https://user@sentry.example.org/123' }
	);
	expect(expandedCSP).toEqual(
		`default-src 'self'; connect-src 'self' https://graphql.example.org:5000 https://sentry.example.org; style-src 'self'`
	);
});
