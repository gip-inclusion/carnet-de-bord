import { getHasuraAdminSecret } from '$lib/config/variables/private';
import { getGraphqlAPI } from '$lib/config/variables/public';
import {
	GetAdminStructureByEmailDocument,
	InsertStructureDocument,
	InsertAdminStructureDocument,
	AdminStructure,
	StructureUpdateColumn,
} from '$lib/graphql/_gen/typed-document-nodes';
import type {
	GetAdminStructureByEmailQuery,
	InsertAdminStructureMutation,
} from '$lib/graphql/_gen/typed-document-nodes';
import { actionsGuard } from '$lib/utils/security';
import type { RequestHandler } from '@sveltejs/kit';
import { createClient } from '@urql/core';

const client = createClient({
	fetch,
	fetchOptions: {
		headers: {
			'Content-Type': 'application/json',
			'x-hasura-admin-secret': getHasuraAdminSecret(),
		},
	},
	requestPolicy: 'network-only',
	url: getGraphqlAPI(),
});

type StructureInput = {
	name: string;
	phone: string;
	email: string;
	address1: string;
	address2: string;
	postalCode: string;
	city: string;
	website: string;
	siret: string;
	shortDesc: string;
};

type AdminStructureInput = {
	adminEmail: string;
	firstname: string;
	lastname: string;
	position: string;
	phoneNumbers: string;
};

type Body = {
	input: {
		structure: StructureInput;
		admin: AdminStructureInput;
		deploymentId: string;
		forceUpdate: boolean;
	};
};

export const post: RequestHandler<unknown, Body> = async (request) => {
	const { input } = request.body;
	try {
		actionsGuard(request.headers);
	} catch (error) {
		return {
			status: 401,
			body: error.message,
		};
	}

	const { deploymentId, structure, admin, forceUpdate } = input;
	console.log(forceUpdate);

	const { error, data } = await client
		.query<GetAdminStructureByEmailQuery>(GetAdminStructureByEmailDocument, {
			id: admin.adminEmail,
		})
		.toPromise();

	let adminStructureId: AdminStructure['id'];
	if (error || !data.admin_structure || data.admin_structure.length === 0) {
		console.info(
			'insert_structure',
			`AdminStructure ${admin.adminEmail} not found. We will try creating it!`
		);

		const { error, data } = await client
			.mutation<InsertAdminStructureMutation>(InsertAdminStructureDocument, {
				...admin,
				deploymentId,
			})
			.toPromise();

		if (error || !data.insert_admin_structure_one?.id) {
			console.error('insert_structure', 'Tried creating new AdminStructure but failed', {
				admin,
				deploymentId,
				error,
			});
			return {
				status: 401,
				body: error.message,
			};
		}
		adminStructureId = data.insert_admin_structure_one.id;
	} else {
		adminStructureId = data.admin_structure[0].id;
	}

	const toUpdate = [
		StructureUpdateColumn.Phone,
		StructureUpdateColumn.Email,
		StructureUpdateColumn.Address1,
		StructureUpdateColumn.Address2,
		StructureUpdateColumn.PostalCode,
		StructureUpdateColumn.City,
		StructureUpdateColumn.Website,
		StructureUpdateColumn.Siret,
		StructureUpdateColumn.ShortDesc,
	];
	const onConflictUpdates: StructureUpdateColumn[] = forceUpdate ? toUpdate : [];
	const insertResult = await client
		.mutation(InsertStructureDocument, {
			...structure,
			onConflictUpdates,
			deploymentId,
			adminStructureId,
		})
		.toPromise();
	if (insertResult.error) {
		console.error(insertResult.error);
		return {
			status: 500,
			body: { error: 'INSERT_FAILED' },
		};
	}
	return {
		status: 200,
		body: { id: insertResult.data?.insert_structure_one?.id },
	};
};
