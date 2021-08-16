import knex from '$lib/config/db/knex';
import { sendEmail } from '$lib/utils/sendEmail';
import { emailMagicLink } from '$lib/utils/emailMagicLink';
import type { RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

const types = ['professional', 'beneficiary', 'admin'] as const;

export type Profile = typeof types[number];

export const post: RequestHandler = async (request) => {
	const { email, appUrl } = request.body as unknown as {
		email: string;
		appUrl: string;
	};

	let profile, type;

	for (const type_ of types) {
		if (!profile) {
			profile = (await knex(`${type_}`).where({ email }).first()) as unknown as {
				id: string;
				firstname: string;
				lastname: string;
			};
			type = type_;
		}
	}

	if (!profile) {
		return {
			status: 401,
			body: {
				errors: 'PROFILE_NOT_FOUND'
			}
		};
	}

	const { firstname, lastname, id } = profile;

	const account = (await knex('account')
		.where({ [`${type}_id`]: id })
		.first()) as unknown as {
		id: string;
		type: Profile;
		beneficiary_id: string;
		professional_id: string;
		admin_id: string;
	};

	if (!account) {
		return {
			status: 401,
			body: {
				errors: 'ACCOUNT_NOT_FOUND'
			}
		};
	}

	const accessKey = uuidv4();

	await knex('account')
		.update({ access_key: accessKey, access_key_date: new Date() })
		.where({ id: account.id });

	// send email
	sendEmail({
		to: email,
		subject: 'Accédez à votre espace Carnet de bord',
		html: emailMagicLink({ firstname, lastname, accessKey, appUrl })
	});

	return {
		status: 200,
		body: {
			email
		}
	};
};
