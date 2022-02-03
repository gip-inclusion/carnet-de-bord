import { getGraphqlAPI } from '$lib/config/variables/public';
import {
	InsertStructureDocument,
	StructureUpdateColumn,
	StructureInput,
	AdminStructureInput,
	InsertAccountAdminStructureDocument,
	InsertAccountAdminStructureMutation,
	GetExistingAdminStructureQuery,
	GetExistingAdminStructureDocument,
	InsertStructureAdminStructureMutation,
	InsertStructureAdminStructureDocument,
	StructureOnConflict,
	StructureConstraint,
} from '$lib/graphql/_gen/typed-document-nodes';
import { actionsGuard } from '$lib/utils/security';
import type { EndpointOutput, RequestHandler } from '@sveltejs/kit';
import { createClient } from '@urql/core';
import { v4 } from 'uuid';
import send from '$lib/emailing';
import { getAppUrl } from '$lib/config/variables/private';

type Body = {
	input: {
		data: {
			structure: StructureInput;
			adminStructure: AdminStructureInput;
			forceUpdate: boolean;
			sendAccountEmail: boolean;
		};
	};
};

function actionError(status = 400, message: string): EndpointOutput {
	return {
		status,
		body: {
			message: message,
		},
	};
}
export const post: RequestHandler<unknown, Body> = async (request) => {
	const { input } = request.body;
	try {
		actionsGuard(request.headers);
	} catch (error) {
		return actionError(401, 'unauthorized');
	}

	const client = createClient({
		fetch,
		fetchOptions: {
			headers: {
				'Content-Type': 'application/json',
				authorization: request.headers['authorization'],
			},
		},
		requestPolicy: 'network-only',
		url: getGraphqlAPI(),
	});

	const { structure, adminStructure, forceUpdate, sendAccountEmail } = input.data;

	// Ensure we have minimal data before starting
	if (!adminStructure.adminEmail || !structure.name || !structure.city || !structure.postalCode) {
		console.log(input);
		return actionError(401, 'missing mandatory fields');
	}

	const { error, data } = await client
		.query<GetExistingAdminStructureQuery>(GetExistingAdminStructureDocument, {
			email: adminStructure.adminEmail,
			name: structure.name,
		})
		.toPromise();

	if (error) {
		console.error('get existing entities', error);
		return actionError(400, 'fetch existing entities failed');
	}
	const [existingStructure] = data.structure;
	const [existingAdmin] = data.admin;

	const onConflict: StructureOnConflict = forceUpdate
		? {
				constraint: StructureConstraint.StructureNameDeploymentIdKey,
				update_columns: [
					StructureUpdateColumn.Phone,
					StructureUpdateColumn.Email,
					StructureUpdateColumn.Address1,
					StructureUpdateColumn.Address2,
					StructureUpdateColumn.PostalCode,
					StructureUpdateColumn.City,
					StructureUpdateColumn.Website,
					StructureUpdateColumn.Siret,
					StructureUpdateColumn.ShortDesc,
				],
		  }
		: // Hack@lionelb:
		  // If we leave update_columns to empty array ,
		  // the insert will not fail (it will just do nothing)
		  // So we put the pkey constraint so insert can fail
		  // when there is no force update flag
		  {
				constraint: StructureConstraint.StructurePkey,
				update_columns: [],
		  };
	const insertStructureResult = await client
		.mutation(InsertStructureDocument, {
			...structure,
			onConflict,
		})
		.toPromise();
	if (insertStructureResult.error) {
		console.error(insertStructureResult.error);
		return actionError(400, insertStructureResult.error.message);
	}

	if (existingStructure) {
		return {
			status: 200,
			body: {
				id: existingStructure.id,
			},
		};
	}

	const structureId = insertStructureResult.data.structure.id || existingStructure.id;
	const accessKey = v4();
	if (!existingAdmin) {
		const { error } = await client
			.mutation<InsertAccountAdminStructureMutation>(InsertAccountAdminStructureDocument, {
				...adminStructure,
				structureId,
				username: v4(),
				accessKey,
				accessKeyDate: new Date(),
			})
			.toPromise();
		if (error) {
			console.error(error);
			return actionError(400, 'Insert admin_structure failed');
		}
		if (sendAccountEmail)
			try {
				let account = null;
				if (adminStructure.firstname && adminStructure.lastname) {
					account = { firstname: adminStructure.firstname, lastname: adminStructure.lastname };
				}
				await send({
					options: {
						to: adminStructure.adminEmail,
						subject: 'Bienvenue sur Carnet de bord',
					},
					template: 'adminStructureAccountCreation',
					params: [
						{
							account,
							structure: structure.name,
							url: {
								accessKey: accessKey,
								appUrl: getAppUrl(),
							},
							email: adminStructure.adminEmail,
						},
					],
				});
			} catch (e) {
				console.error(
					'InsertStructureWithAdmin',
					`Could not send email to email ${adminStructure.adminEmail}`
				);
			}

		return {
			status: 200,
			body: {
				id: structureId,
			},
		};
	}

	const adminStructureId = existingAdmin.id;
	const insertStructureAdminStructureResult = await client
		.mutation<InsertStructureAdminStructureMutation>(InsertStructureAdminStructureDocument, {
			adminStructureId,
			structureId,
		})
		.toPromise();
	if (insertStructureAdminStructureResult.error) {
		console.error(insertStructureAdminStructureResult.error);
		return actionError(400, 'Insert admin_structure_structure relation failed');
	}

	return {
		status: 200,
		body: { id: structureId },
	};
};
