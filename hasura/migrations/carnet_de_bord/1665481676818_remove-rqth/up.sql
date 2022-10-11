
-- move rqth data to notebook
UPDATE notebook set right_rqth = True where id in (
	select notebook_id
	from notebook_focus
	WHERE situations ? 'RQTH - Rreconnaissance de la Qualité de Travailleur Handicapé'
);

-- Remove Rqth from ref_situation
DELETE FROM public.ref_situation WHERE description='RQTH - Rreconnaissance de la Qualité de Travailleur Handicapé';
-- Remove Rqth from existing focus
UPDATE notebook_focus set situations = situations - 'RQTH - Rreconnaissance de la Qualité de Travailleur Handicapé'  WHERE situations ? 'RQTH - Rreconnaissance de la Qualité de Travailleur Handicapé';
