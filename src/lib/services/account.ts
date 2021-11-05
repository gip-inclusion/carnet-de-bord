import {
	UpdateAccountAccessKeyDocument,
	UpdateAccountAccessKeyMutation,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { Client, OperationResult } from '@urql/core';
import { v4 as uuidv4 } from 'uuid';

export async function updateAccessKey(
	client: Client,
	accountId: string
): Promise<OperationResult<UpdateAccountAccessKeyMutation>> {
	const accessKey = uuidv4();

	return client
		.mutation(UpdateAccountAccessKeyDocument, {
			id: accountId,
			accessKey: accessKey,
			accessKeyDate: new Date(),
		})
		.toPromise();
}
