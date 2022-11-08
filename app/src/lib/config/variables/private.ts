import type { Algorithm } from 'jsonwebtoken';
import { logger } from '$lib/utils/logger';

export const getBackendAPI = (): string => {
	return process.env['BACKEND_API_URL'];
};

export const getGraphqlAPI = (): string => {
	return process.env['GRAPHQL_API_URL'];
};

export function getApiParticulierConfig(): {
	API_PARTICULIER_URL: string;
	API_PARTICULIER_TOKEN_CAF: string;
	API_PARTICULIER_TOKEN_PE: string;
} {
	return {
		API_PARTICULIER_URL: process.env['API_PARTICULIER_URL'],
		API_PARTICULIER_TOKEN_CAF: process.env['API_PARTICULIER_TOKEN_CAF'],
		API_PARTICULIER_TOKEN_PE: process.env['API_PARTICULIER_TOKEN_PE'],
	};
}

export function getDatabaseUrl(): string {
	return process.env['DATABASE_URL'] || process.env['HASURA_GRAPHQL_DATABASE_URL'];
}

export function getAppUrl(): string {
	return process.env['APP_URL'];
}

export function getSmtpConfig(): {
	SMTP_FROM: string;
	SMTP_HOST: string;
	SMTP_PASS: string;
	SMTP_PORT: number;
	SMTP_USER: string;
} {
	const { SMTP_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } = process.env;
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
	const hasuraJwtSecret = process.env['HASURA_GRAPHQL_JWT_SECRET'];
	let jwtSecret: JwtKey;
	try {
		jwtSecret = JSON.parse(hasuraJwtSecret);
	} catch (error) {
		logger.error(`[JWT], HASURA_GRAPHQL_JWT_SECRET is not a valid json ${hasuraJwtSecret}`);
	}
	return jwtSecret;
}

export function getHasuraAdminSecret(): string {
	return process.env['HASURA_GRAPHQL_ADMIN_SECRET'];
}

export function getActionSecret(): string {
	return process.env['ACTION_SECRET'];
}
