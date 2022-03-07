import type { JwtPayload } from '$lib/utils/getJwt';
import jwtDecode from 'jwt-decode';
import * as Matomo from '$lib/tracking/matomo';

export type Session = {
	token?: string;
	user?: Record<string, any>;
};

export const authenticateWithBody = async (body: string, session: Session, prefix = '') => {
	let response: Response;
	try {
		response = await fetch(`${prefix}/auth/jwt`, {
			method: 'POST',
			headers: {
				Accept: 'application/json; version=1.0',
				'Content-Type': 'application/json',
			},
			body,
		});
	} catch (error) {
		console.log('Could not authenticate', { error, body, prefix, session });
		return null;
	}

	if (response.ok) {
		const { jwt } = await response.json();
		const user = jwtDecode<JwtPayload>(jwt);
		session.user = user;
		session.token = jwt;
		Matomo.setCustomDimension(Matomo.CustomDimensions.Role, session.user.role);
		if (session.user.deploymentId) {
			Matomo.setCustomDimension(Matomo.CustomDimensions.Deployment, session.user.deploymentId);
		}
		// if it worked, we pass the headers in case we did this in XHR and need the actual request to correctly set the refresh cookie
		return { headers: response.headers };
	}

	return null;
};
