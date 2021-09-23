import knex from '$lib/config/db/knex';
import { getAppUrl } from '$lib/config/variables/private';
import { contactEmail } from '$lib/constants';
import type { Account, AccountRequest } from '$lib/types';
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

	const { email, firstname, lastname, mobileNumber, position } = accountRequest;
	let [username] = email.split('@');
	const accounts = await knex<Account>('account').where({ username: `like ${username}%` });

	if (accounts.length > 0) {
		const matcher = new RegExp(`^${username}(\\d*)$`);
		const index = accounts.reduce((maxIndex, item) => {
			const matched = item.username.match(matcher);
			if (!matched) {
				return maxIndex;
			}
			if (isNaN(parseInt(matched[1]))) {
				return maxIndex;
			}
			return Math.max(parseInt(matched[1]), maxIndex);
		}, 0);
		username += `${index + 1}`;
	}

	const existingPro = (await knex(`${type}`).where({ email }).first()) as unknown;

	if (existingPro) {
		return {
			status: 400,
			body: {
				errors: { email: 'Cet email est déjà utilisé.' },
			},
		};
	}

	const [professionalId] = await knex(`${type}`)
		.insert({
			email,
			lastname,
			firstname,
			structure_id: structureId,
			mobile_number: mobileNumber,
			position,
		})
		.returning('id');

	await knex('account').insert({
		username,
		professional_id: professionalId,
		type,
	});

	const appUrl = getAppUrl();

	// send email to first admin
	try {
		await sendEmail({
			to: contactEmail,
			subject: 'Demande de création de compte',
			html: emailAccountRequest({
				firstname,
				lastname,
				appUrl,
				requester,
			}),
		});
	} catch (e) {
		console.log(e);
	}

	return {
		status: 200,
		body: { professionalId },
	};
};
