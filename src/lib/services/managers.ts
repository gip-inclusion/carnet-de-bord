import type { DeploymentAdminPdiType } from '$lib/ui/Deployment/adminDeployment.schema';
import { post } from '$lib/utils/post';

export async function createManager(
	url,
	data: { deployment_id: string } & DeploymentAdminPdiType,
	headers: Record<string, string>
) {
	return post(url, data, headers).then((resp) => resp.json());
}
