import type { DeploymentAdminPdiType } from '$lib/ui/Deployment/adminDeployment.schema';
import type { AdminStructureAccountInput } from '$lib/ui/AdminStructure/adminStructure.schema';
import { post } from '$lib/utils/post';
import { backendAPI } from '$lib/stores';
import { get } from 'svelte/store';
export async function postManager(
	url,
	data: { deployment_id: string } & DeploymentAdminPdiType,
	headers: Record<string, string>
) {
	const baseUrl = get(backendAPI);
	return post(`${baseUrl}${url}`, data, headers).then(handleResponse);
}
export async function postAdminStructure(
	url,
	data: { admin: { deployment_id: string } & AdminStructureAccountInput; structure_id: string },
	headers: Record<string, string>
) {
	const baseUrl = get(backendAPI);
	return post(`${baseUrl}${url}`, data, headers).then(handleResponse);
}

async function handleResponse(response: Response) {
	if (response.ok) {
		return response.json();
	}
	const errorMessage = await response.text();
	return Promise.reject(new Error(errorMessage));
}
