import knex from '$lib/config/db/knex';
import type { RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '$lib/utils/sendEmail';
import { emailMagicLink } from '$lib/utils/emailMagicLink';
import type { AccountRequest } from '$lib/types';
import { contactEmail } from '$lib/constants';

const type = 'professional';

export const post: RequestHandler = async (request) => {
	const { accountRequest, structureId, appUrl } = request.body as unknown as {
		accountRequest: AccountRequest;
		structureId: string;
		appUrl: string;
	};

	const { username, email, firstname, lastname } = accountRequest;

	const account = (await knex('account').where({ username }).first()) as unknown;

	if (account) {
		/* @TODO give better hints */
		const hints = 'Essayez autre chose !';
		return {
			status: 400,
			body: {
				errors: { username: `Cet identifiant est déjà utilisé. ${hints}` }
			}
		};
	}

	const existingPro = (await knex(`${type}`).where({ email }).first()) as unknown;

	if (existingPro) {
		return {
			status: 400,
			body: {
				errors: { username: 'Cet email est déjà utilisé.' }
			}
		};
	}

	await knex(`${type}`).insert({
		email,
		lastname,
		firstname,
		structure_id: structureId
	});

	const professional = (await knex(`${type}`).where({ email }).first()) as unknown as {
		id: string;
	};

	const professional_id = professional.id;

	await knex('account').insert({
		username,
		professional_id,
		type,
		onboarding: false,
		confirmed: false
	});

	const firstAdmin = await knex('account').where({ type: 'admin', confirmed: true }).first();

	const accessKey = uuidv4();

	await knex('account')
		.update({ access_key: accessKey, access_key_date: new Date() })
		.where({ id: firstAdmin.id });

	// send email to first admin
	sendEmail({
		to: contactEmail,
		subject: 'Nouvelle requête de compte Pro',
		html: emailMagicLink({
			firstname: firstAdmin.firstname,
			lastname: firstAdmin.lastname,
			accessKey,
			appUrl
		})
	});

	return {
		status: 200,
		body: {}
	};
};
