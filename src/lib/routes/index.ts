export type Segment = {
	name: string;
	path: string;
	label: string;
};

export type Route = {
	path: string;
};

const login: Route = {
	path: '/auth/login'
};
const proHome: Route = {
	path: '/pro/accueil'
};
const adminHome: Route = {
	path: '/admin/utilisateurs'
};
const beneficiaryHome: Route = {
	path: '/particulier'
};
const homes: Record<string, Route> = {
	professional: proHome,
	admin: adminHome,
	beneficiary: beneficiaryHome
};

export const routes = {
	login,
	proHome,
	adminHome,
	beneficiaryHome
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

export const getSegments = (currentPath: string): Segment[] => {
	const segments = [{ name: 'accueil', label: 'Accueil', path: '/' }];

	if (currentPath === '/pro/annuaire') {
		segments.push({ name: 'annuaire', label: 'Annuaire des bénéficiaires', path: '/pro/annuaire' });
	}

	if (currentPath.startsWith('/pro/beneficiaire/')) {
		segments.push({ name: 'annuaire', label: 'Annuaire des bénéficiaires', path: '/pro/annuaire' });
		segments.push({ name: 'beneficiaire', label: 'Profil bénéficiaire', path: '' });
	}

	if (currentPath.startsWith('/pro/moncompte')) {
		segments.push({ name: 'moncompte', label: 'Mon compte', path: '/pro/moncompte' });
	}

	return segments;
};
