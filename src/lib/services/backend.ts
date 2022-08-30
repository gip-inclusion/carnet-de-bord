import type { DeploymentAdminPdiType } from '$lib/ui/Deployment/adminDeployment.schema';
import type { AdminStructureAccountInput } from '$lib/ui/AdminStructure/adminStructure.schema';
import { post } from '$lib/utils/post';

export async function postManager(
	url,
	data: { deployment_id: string } & DeploymentAdminPdiType,
	headers: Record<string, string>
) {
	return post(url, data, headers).then((resp) => resp.json());
}
export async function postAdminStructure(
	url,
	data: { admin: { deployment_id: string } & AdminStructureAccountInput; structure_id: string },
	headers: Record<string, string>
) {
	return post(url, data, headers).then((resp) => resp.json());
}
