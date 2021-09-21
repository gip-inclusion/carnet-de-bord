import knex from '$lib/config/db/knex';
import type { RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { getAppUrl } from '$lib/config/variables/private';
import { sendEmail } from '$lib/utils/sendEmail';
import { emailNotebookInvitation } from '$lib/utils/emailNotebookInvitation';

export const post: RequestHandler = async (request) => {
	const { notebookMemberId } = request.body as unknown as {
		notebookMemberId: string;
	};

	const notebookMember = (await knex('notebook_member')
		.where({ id: notebookMemberId })
		.first()) as {
		id: string;
		creator_id: string;
		professional_id: string;
		notebook_id: string;
	};

	const {
		notebook_id: notebookId,
		professional_id: professionalId,
		creator_id: creatorId,
	} = notebookMember;

	const professional = await knex('professional').where({ id: professionalId }).first();
	const creator = await knex('professional').where({ id: creatorId }).first();

	const account = (await knex('account').where({ professional_id: professionalId }).first()) as {
		id: string;
		type: string;
		username: string;
		professional_id: string;
		beneficiary_id: string;
		confirmed: boolean;
	};

	if (!account.confirmed) {
		return {
			status: 200,
			body: {},
		};
	}

	const accessKey = uuidv4();

	await knex('account')
		.update({ access_key: accessKey, access_key_date: new Date() })
		.where({ id: account.id });

	const appUrl = getAppUrl();

	const { firstname: creatorFirstname, lastname: creatorLastname } = creator;
	const { firstname, lastname, email } = professional;

	// send email

	try {
		await sendEmail({
			to: email,
			subject: 'Invitation à rejoindre un carnet de bord',
			html: emailNotebookInvitation({
				creatorFirstname,
				creatorLastname,
				firstname,
				lastname,
				accessKey,
				appUrl,
				notebookId,
			}),
		});
	} catch (e) {
		console.log(e);
	}

	return {
		status: 200,
		body: {
			email,
		},
	};
};
