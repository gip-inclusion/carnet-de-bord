import { config } from 'dotenv';

config();

export function getDatabaseUrl(): string {
	return process.env['DATABASE_URL'];
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
		SMTP_USER
	};
}

export function getJwtKey(): {
	key: string;
	type: string;
} {
	const hasuraJwtSecret = process.env['HASURA_GRAPHQL_JWT_SECRET'];
	let jwtSecret;
	try {
		jwtSecret = JSON.parse(hasuraJwtSecret);
	} catch (error) {
		console.error(`[JWT], HASURA_GRAPHQL_JWT_SECRET is not a valid json ${hasuraJwtSecret}`);
	}
	return jwtSecret;
}
