import {
	UpdateAccountAccessKeyDocument,
	UpdateAccountAccessKeyMutationVariables,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { UpdateAccountAccessKeyMutation } from '$lib/graphql/_gen/typed-document-nodes';
import type { Client, OperationResult } from '@urql/core';
import { v4 as uuidv4 } from 'uuid';

export async function updateAccessKey(
	client: Client,
	accountId: string,
	confirmed?: boolean
): Promise<OperationResult<UpdateAccountAccessKeyMutation>> {
	const accessKey = uuidv4();

	const input: UpdateAccountAccessKeyMutationVariables['input'] = {
		accessKey,
		accessKeyDate: new Date().toISOString(),
	};
	if (typeof confirmed !== 'undefined') {
		input.confirmed = confirmed;
	}
	return client
		.mutation(UpdateAccountAccessKeyDocument, {
			id: accountId,
			input,
		})
		.toPromise();
}
