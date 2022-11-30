import type { Algorithm } from 'jsonwebtoken';
import { logger } from '$lib/utils/logger';
import { env } from '$env/dynamic/private';

export const getBackendAPI = (): string => {
	return env['BACKEND_API_URL'];
};

export const getGraphqlAPI = (): string => {
	return env['GRAPHQL_API_URL'];
};

export function getApiParticulierConfig(): {
	API_PARTICULIER_URL: string;
	API_PARTICULIER_TOKEN_CAF: string;
	API_PARTICULIER_TOKEN_PE: string;
} {
	return {
		API_PARTICULIER_URL: env['API_PARTICULIER_URL'],
		API_PARTICULIER_TOKEN_CAF: env['API_PARTICULIER_TOKEN_CAF'],
		API_PARTICULIER_TOKEN_PE: env['API_PARTICULIER_TOKEN_PE'],
	};
}

export function getDatabaseUrl(): string {
	return env['DATABASE_URL'] || env['HASURA_GRAPHQL_DATABASE_URL'];
}

export function getAppUrl(): string {
	return env['APP_URL'];
}

export function getSmtpConfig(): {
	SMTP_FROM: string;
	SMTP_HOST: string;
	SMTP_PASS: string;
	SMTP_PORT: number;
	SMTP_USER: string;
} {
	const { SMTP_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } = env;
	return {
		SMTP_FROM,
		SMTP_HOST,
		SMTP_PASS,
		SMTP_PORT: parseInt(SMTP_PORT),
		SMTP_USER,
	};
}

type JwtKey = {
	key: string;
	type: Algorithm;
};
export function getJwtKey(): JwtKey {
	const hasuraJwtSecret = env['HASURA_GRAPHQL_JWT_SECRET'];
	let jwtSecret: JwtKey;
	try {
		jwtSecret = JSON.parse(hasuraJwtSecret);
	} catch (error) {
		logger.error(`[JWT], HASURA_GRAPHQL_JWT_SECRET is not a valid json ${hasuraJwtSecret}`);
	}
	return jwtSecret;
}

export function getHasuraAdminSecret(): string {
	return env['HASURA_GRAPHQL_ADMIN_SECRET'];
}

export function getActionSecret(): string {
	return env['ACTION_SECRET'];
}

export function getSandboxLogin(): boolean {
	return env['SANDBOX_LOGIN'] === 'true';
}
