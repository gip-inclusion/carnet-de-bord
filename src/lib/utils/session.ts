import type { JwtPayload } from '$lib/utils/getJwt';
import jwtDecode from 'jwt-decode';
import * as Matomo from '$lib/tracking/matomo';

export const authenticateWithBody = async (body: string, session) => {
	const response: Response = await fetch(`/auth/jwt`, {
		method: 'POST',
		headers: {
			Accept: 'application/json; version=1.0',
			'Content-Type': 'application/json',
		},
		body,
	});

	if (response.ok) {
		const { jwt } = await response.json();
		const user = jwtDecode<JwtPayload>(jwt);
		session.user = user;
		session.token = jwt;
		Matomo.setCustomDimension(Matomo.CustomDimensions.Role, session.user.role);
		if (session.user.deploymentId) {
			Matomo.setCustomDimension(Matomo.CustomDimensions.Deployment, session.user.deploymentId);
		}
	}

	return !!response.ok;
};
