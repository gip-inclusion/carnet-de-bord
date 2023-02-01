UPDATE public.ref_situation SET description = 'Problème déclaré entravant l’exercice de certains métiers' WHERE description = 'Problème de santé déclaré entravant l’exercice de certains métiers';
UPDATE public.ref_situation SET description = 'Problème déclaré n’entravant pas la reprise d’une activité professionnelle' WHERE description = 'Problème de santé déclaré n’entravant pas la reprise d’une activité professionnelle';
UPDATE public.ref_situation SET description = 'Problème déclaré entrainant des absences régulières' WHERE description = 'Problème de santé déclaré entrainant des absences régulières';
UPDATE public.ref_situation SET description = 'Problème déclaré ne permettant plus d’exercer une activité professionnelle' WHERE description = 'Problème de santé déclaré ne permettant plus d’exercer une activité professionnelle';
UPDATE public.ref_situation SET description = 'Problème déclaré ne permettant pas de reprendre une activité professionnelle immédiate' WHERE description = 'Problème de santé déclaré ne permettant pas de reprendre une activité professionnelle immédiate';

UPDATE notebook_focus set situations = situations - 'Problème de santé déclaré entravant l’exercice de certains métiers' || '["Problème déclaré entravant l’exercice de certains métiers"]'::jsonb  WHERE situations ? 'Problème de santé déclaré entravant l’exercice de certains métiers';
UPDATE notebook_focus set situations = situations - 'Problème de santé déclaré n’entravant pas la reprise d’une activité professionnelle' || '["Problème déclaré n’entravant pas la reprise d’une activité professionnelle"]'::jsonb  WHERE situations ? 'Problème de santé déclaré n’entravant pas la reprise d’une activité professionnelle';
UPDATE notebook_focus set situations = situations - 'Problème de santé déclaré entrainant des absences régulières' || '["Problème déclaré entrainant des absences régulières"]'::jsonb  WHERE situations ? 'Problème de santé déclaré entrainant des absences régulières';
UPDATE notebook_focus set situations = situations - 'Problème de santé déclaré ne permettant plus d’exercer une activité professionnelle' || '["Problème déclaré ne permettant plus d’exercer une activité professionnelle"]'::jsonb  WHERE situations ? 'Problème de santé déclaré ne permettant plus d’exercer une activité professionnelle';
UPDATE notebook_focus set situations = situations - 'Problème de santé déclaré ne permettant pas de reprendre une activité professionnelle immédiate' || '["Problème déclaré ne permettant pas de reprendre une activité professionnelle immédiate"]'::jsonb  WHERE situations ? 'Problème de santé déclaré ne permettant pas de reprendre une activité professionnelle immédiate';