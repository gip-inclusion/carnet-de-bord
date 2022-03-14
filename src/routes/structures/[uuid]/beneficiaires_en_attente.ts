import { userClient } from '$lib/graphql/createClient';
import { GetPendingBeneficiariesDocument } from '$lib/graphql/_gen/typed-document-nodes';
import { authorizeOnly } from '$lib/utils/security';
import type { RequestHandler } from '@sveltejs/kit';
import { parse } from 'cookie';

export const get: RequestHandler = async ({ request, params }) => {
	try {
		authorizeOnly(['admin_structure'])(request);
	} catch (e) {
		return {
			status: 403,
			body: {
				message: 'unauthorized',
			},
		};
	}
	const cookie = parse(request.headers.get('cookie'));

	const client = userClient(`Bearer ${cookie.jwt}`);

	const structureId = params.uuid;

	const result = await client.query(GetPendingBeneficiariesDocument, { structureId }).toPromise();
	if (result.error) {
		console.error(`Error query pending beneficiary for structure ${structureId}`, {
			error: result.error,
		});
		return {
			status: 500,
			body: { error: 'error retriving pending beneficiaries' },
		};
	}

	const data = result.data.structure_by_pk.beneficiaries
		.map(
			({ beneficiary }) =>
				`${beneficiary.notebook?.id};${beneficiary.lastname};${beneficiary.firstname};${beneficiary.dateOfBirth};`
		)
		.join('\n');
	const csv = `id; nom; prénom; date de naissance; emails des professionnels\n${data}\n`;
	return {
		status: 200,
		headers: {
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': 'attachment;filename=beneficiaires_en_attente.csv',
			'Content-Length': `${csv.length}`,
		},
		body: csv,
	};
};
