export type Segment = {
	name: string;
	path: string;
	label: string;
};

export type Route = {
	path: string;
};

const login: Route = {
	path: '/auth/login',
};
const proHome: Route = {
	path: '/pro/accueil',
};
const adminHome: Route = {
	path: '/admin',
};

const managerHome: Route = {
	path: '/manager/utilisateurs',
};

const beneficiaryHome: Route = {
	path: '/particulier',
};
const homes: Record<string, Route> = {
	professional: proHome,
	admin: adminHome,
	beneficiary: beneficiaryHome,
	manager: managerHome,
};

export const routes = {
	login,
	proHome,
	managerHome,
	adminHome,
	beneficiaryHome,
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
	} else if (role === 'admin') {
		return '/admin';
	} else if (role === 'beneficiary') {
		return '/particulier';
	} else if (role === 'manager') {
		return '/manager';
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
