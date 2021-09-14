import knex from '$lib/config/db/knex';
import { getAppUrl } from '$lib/config/variables/private';
import { contactEmail } from '$lib/constants';
import type { AccountRequest } from '$lib/types';
import { emailAccountRequest } from '$lib/utils/emailAccountRequest';
import { sendEmail } from '$lib/utils/sendEmail';
import type { RequestHandler } from '@sveltejs/kit';

const type = 'professional';

export const post: RequestHandler = async (request) => {
	const { accountRequest, structureId, requester } = request.body as unknown as {
		accountRequest: AccountRequest;
		structureId: string;
		requester?: string;
	};

	const { username, email, firstname, lastname, mobileNumber, position } = accountRequest;

	const account = (await knex('account').where({ username }).first()) as unknown;

	if (account) {
		return {
			status: 400,
			body: {
				errors: { username: `Cet identifiant est déjà utilisé.` }
			}
		};
	}

	const existingPro = (await knex(`${type}`).where({ email }).first()) as unknown;

	if (existingPro) {
		return {
			status: 400,
			body: {
				errors: { email: 'Cet email est déjà utilisé.' }
			}
		};
	}

	const [professionalId] = await knex(`${type}`)
		.insert({
			email,
			lastname,
			firstname,
			structure_id: structureId,
			mobile_number: mobileNumber,
			position
		})
		.returning('id');

	await knex('account').insert({
		username,
		professional_id: professionalId,
		type
	});

	const appUrl = getAppUrl();

	// send email to first admin
	await sendEmail({
		to: contactEmail,
		subject: 'Demande de création de compte',
		html: emailAccountRequest({
			firstname,
			lastname,
			appUrl,
			requester
		})
	});

	return {
		status: 200,
		body: { professionalId }
	};
};
