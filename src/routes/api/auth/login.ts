import { sendEmail } from '$business/EmailSender';
import Account from '$database/Account';
import type { RequestHandler } from '@sveltejs/kit';
import type { IBeneficiary, IProfessional } from 'src/global';
import { v4 as uuidv4 } from 'uuid';

export const post: RequestHandler = async (request) => {
	const { username } = request.body as unknown as {
		username: string;
	};

	console.log(username);

	const account = await await Account.query().findOne({ username });

	if (!account) {
		return {
			status: 401,
			body: {
				errors: 'USER_NOT_FOUND'
			}
		};
	}

	const { contact, civilStatus } = (await account.$relatedQuery(account.type)) as unknown as
		| IBeneficiary
		| IProfessional;

	const { lastname, firstname } = civilStatus;

	const accessKey = uuidv4();

	await Account.query()
		.update({ accessKey, accessKeyDate: new Date() })
		.where({ username: account.username });

	// send email
	sendEmail({
		to: contact.email,
		subject: 'Accédez à votre espace Carnet de bord',
		text: `Bonjour ${firstname} ${lastname},

    Pour accéder à votre espace Carnet de bord, veuillez cliquer sur le lien ci-dessous:

    http://localhost:3000/auth/jwt/${accessKey}

    L'équipe Carnet de bord`
	});

	return {
		status: 200,
		body: {
			email: contact.email
		}
	};
};
