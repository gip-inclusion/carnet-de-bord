import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';

export type Segment = {
	name?: string;
	path?: string;
	label: string;
};

export type Route = {
	path: string;
};

const login: Route = {
	path: '/auth/login',
};
const proHome: Route = {
	path: '/pro',
};
const adminHome: Route = {
	path: '/admin',
};

const managerHome: Route = {
	path: '/manager',
};

const beneficiaryHome: Route = {
	path: '/beneficiaire',
};

const adminStructureHome: Route = {
	path: '/structures',
};

const orientationManagerHome: Route = {
	path: '/orientation',
};
export type AppRoles =
	| 'professional'
	| 'admin_cdb'
	| 'beneficiary'
	| 'manager'
	| 'admin_structure'
	| 'orientation_manager';

const homes: Record<AppRoles, Route> = {
	professional: proHome,
	admin_cdb: adminHome,
	beneficiary: beneficiaryHome,
	manager: managerHome,
	admin_structure: adminStructureHome,
	orientation_manager: orientationManagerHome,
};

export const homeForRole = (role: string): string => {
	return (homes[role] || login).path;
};

export const baseUrlForRole = (role: string): string => {
	if (!role) {
		return '/';
	}
	if (role === 'professional') {
		return '/pro';
	} else if (role === 'admin_cdb') {
		return '/admin';
	} else if (role === 'beneficiary') {
		return '/beneficiaire';
	} else if (role === 'manager') {
		return '/manager';
	} else if (role === 'admin_structure') {
		return '/structures';
	} else if (role === 'orientation_manager') {
		return '/orientation';
	}
	throw new Error(`role ${role} is not handled!`);
};

export const isCurrentRoute = (currentPath: string, route: string): boolean => {
	if (route === currentPath) {
		return true;
	}
	if (route === '/pro/annuaire' && currentPath.startsWith('/pro/benefici')) {
		return true;
	}
	if (route === '/pro/accueil' && currentPath === '/pro/accueil') {
		return true;
	}
};
export function getRealCarnetUrl(role: string, notebookId: string, structureId?: string): string {
	switch (role) {
		case RoleEnum.Professional:
			return `${homeForRole(role)}/carnet/${notebookId}`;
		case RoleEnum.AdminStructure:
			return `${homeForRole(role)}/structures/${structureId}/carnets/${notebookId}`;
		case RoleEnum.OrientationManager:
			return `${homeForRole(role)}/carnets/${notebookId}`;
		case RoleEnum.Manager:
			return `${homeForRole(role)}/carnets/${notebookId}`;
	}
	return '/';
}
