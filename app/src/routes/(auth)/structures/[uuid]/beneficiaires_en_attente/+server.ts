import { error, json as json$1 } from '@sveltejs/kit';
import { getGraphqlAPI } from '$lib/config/variables/private';
import { GetPendingBeneficiariesDocument } from '$lib/graphql/_gen/typed-document-nodes';
import { authorizeOnly } from '$lib/utils/security';
import type { RequestHandler } from '@sveltejs/kit';
import { createClient } from '@urql/core';
import { parse } from 'cookie';

export const GET: RequestHandler = async ({ request, params }) => {
	console.log('list beneficiary');
	try {
		authorizeOnly(['admin_structure'])(request);
	} catch (e) {
		console.log('pag');
		return json$1(
			{
				message: 'unauthorized',
			},
			{
				status: 403,
			}
		);
	}
	const cookie = parse(request.headers.get('cookie'));

	const client = createClient({
		fetch,
		fetchOptions: {
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${cookie.jwt}`,
			},
		},
		requestPolicy: 'network-only',
		url: getGraphqlAPI(),
	});

	const structureId = params.uuid;

	console.log(`[get pending beneficiary for structure] ${params.uuid}`);

	const result = await client.query(GetPendingBeneficiariesDocument, { structureId }).toPromise();
	if (result.error) {
		console.error(`Error query pending beneficiary for structure ${structureId}`, {
			error: result.error,
		});
		throw error(500, 'error retriving pending beneficiaries');
	}

	const data = result.data.structure_by_pk.beneficiaries
		.map(
			({ beneficiary }) =>
				`${beneficiary.notebook?.id};${beneficiary.lastname};${beneficiary.firstname};${beneficiary.dateOfBirth};`
		)
		.join('\n');
	const encoder = new TextEncoder();
	const csv = encoder.encode(
		`\ufeffid; nom; prénom; date de naissance; emails des professionnels\n${data}\n`
	);
	console.log(
		`${result.data.structure_by_pk.beneficiaries.length} en attente - taille ${csv.length}o`
	);
	const headers = new Headers();
	headers.append('Content-Type', 'data:text/csv;charset=UTF-8');
	headers.append('Content-Disposition', 'attachment;filename=beneficiaires_en_attente.csv');
	headers.append('Content-Length', `${csv.length}`);
	return new Response(csv, { headers });
};
