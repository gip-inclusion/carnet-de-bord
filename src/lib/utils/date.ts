import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDate(value: string): string {
	if (!value) {
		return null;
	}
	return format(new Date(value), 'dd MMMM yyyy', {
		locale: fr
	});
}
