
--
-- update json migrations
--
 UPDATE notebook_focus set situations = situations - 'Sans papiers d’identités, titre de séjour…' || '["Difficulté à accéder à un justificatif d''identité"]'::jsonb  WHERE situations ? 'Sans papiers d’identités, titre de séjour…';
 UPDATE notebook_focus set situations = situations - 'Sans avis d’imposition' || '["Difficulté à accéder à son avis d’imposition"]'::jsonb  WHERE situations ? 'Sans avis d’imposition';
 UPDATE notebook_focus set situations = situations - 'Pas de sécurité sociale à jour' || '["Sécurité sociale à mettre à jour"]'::jsonb  WHERE situations ? 'Pas de sécurité sociale à jour';
 UPDATE notebook_focus set situations = situations - 'Autonome mais nécessitant d''être guidé dans le cadre d''un accès aux droits' || '["Besoin d''être guidé dans le cadre d''un accès aux droits"]'::jsonb  WHERE situations ? 'Autonome mais nécessitant d''être guidé dans le cadre d''un accès aux droits';
 UPDATE notebook_focus set situations = situations - 'Ressources précaires ou ponctuelles' || '["Ressources précaires"]'::jsonb  WHERE situations ? 'Ressources précaires ou ponctuelles';
 UPDATE notebook_focus set situations = situations - 'Incidents budgétaires ponctuels' || '["Baisse des ressources"]'::jsonb  WHERE situations ? 'Incidents budgétaires ponctuels';
 UPDATE notebook_focus set situations = situations - 'Inadéquation charges / ressources' || '["Difficulté dans la gestion d''un budget"]'::jsonb  WHERE situations ? 'Inadéquation charges / ressources';
 UPDATE notebook_focus set situations = situations - 'Rupture alimentaire' || '["Besoin d''un soutien alimentaire"]'::jsonb  WHERE situations ? 'Rupture alimentaire';
 UPDATE notebook_focus set situations = situations - 'Prêt mais pas pour n''importe quel emploi' || '["Indisponible pour un emploi dans l''immédiat"]'::jsonb  WHERE situations ? 'Prêt mais pas pour n''importe quel emploi';
 UPDATE notebook_focus set situations = situations - 'Pas prêt pour un emploi' || '["Indisponible pour un emploi dans l''immédiat"]'::jsonb  WHERE situations ? 'Pas prêt pour un emploi';
 UPDATE notebook_focus set situations = situations - 'Ne sais pas s''il est prêt pour un emploi' || '["Indisponible pour un emploi dans l''immédiat"]'::jsonb  WHERE situations ? 'Ne sais pas s''il est prêt pour un emploi';
 UPDATE notebook_focus set situations = situations - 'En projet de profession libérale' || '["Autoentrepreneur / travailleur indépendant / conjoint collaborateur"]'::jsonb  WHERE situations ? 'En projet de profession libérale';
 UPDATE notebook_focus set situations = situations - 'Prêt à en parler' || '["Prêt pour une formation avec un accompagnement"]'::jsonb  WHERE situations ? 'Prêt à en parler';
 UPDATE notebook_focus set situations = situations - 'Prêt pour une formation' || '["Prêt à suivre une formation"]'::jsonb  WHERE situations ? 'Prêt pour une formation';
 UPDATE notebook_focus set situations = situations - 'Prêt pour un accompagnement' || '["Prêt pour une formation avec un accompagnement"]'::jsonb  WHERE situations ? 'Prêt pour un accompagnement';
 UPDATE notebook_focus set situations = situations - 'Ne sais pas s''il est prêt' || '["Ne souhaite pas suivre une formation"]'::jsonb  WHERE situations ? 'Ne sais pas s''il est prêt';
 UPDATE notebook_focus set situations = situations - 'Logement de fortune (caravane, mobile home...)' || '["Habitat mobile"]'::jsonb  WHERE situations ? 'Logement de fortune (caravane, mobile home...)';
 UPDATE notebook_focus set situations = situations - 'Eloigné de tout' || '["Territoire rural isolé"]'::jsonb  WHERE situations ? 'Eloigné de tout';
 UPDATE notebook_focus set situations = situations - 'Autre' || '["Autre type de logement ( hôtel… )"]'::jsonb  WHERE situations ? 'Autre';
 UPDATE notebook_focus set situations = situations - 'Illectronisme' || '["Accès ou utilisation difficile des outils numériques"]'::jsonb  WHERE situations ? 'Illectronisme';
 UPDATE notebook_focus set situations = situations - 'Absence de couverture / complémentaire sociale santé ( CSS, PUMa… )' || '["Couverture sociale à mettre à jour"]'::jsonb  WHERE situations ? 'Absence de couverture / complémentaire sociale santé ( CSS, PUMa… )';

--
-- Remove duplicate values after merge / modify situations
--
 UPDATE notebook_focus as focus set situations = (
  SELECT to_json(array (
    SELECT to_json(T)->>'jsonb_array_elements' as situations FROM (
        SELECT DISTINCT jsonb_array_elements(situations)
        FROM notebook_focus as f
        WHERE f.id =  focus.id
    ) T
  )));


--
-- insert migrations
--
INSERT INTO public.ref_target (id, description, theme) VALUES('8104b5c1-c898-4143-b75e-f39da9677864', 'Travailler les techniques de recherches d''emplois', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES('38a7827d-b822-408b-8a04-c1d74fa5bd15', 'Travailler le CV', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES('4eab1fd6-9bf9-4b3a-8c65-26f9318fe8c2', 'Travailler la lettre de motivation', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES('580b275f-ca2e-4a1a-96f1-780c2b89bb07', 'Réalisation d''enquêtes métiers', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES('89330e81-c980-4f75-bfeb-cb51a06445cb', 'Réalisation d''enquêtes formations', 'formation');
INSERT INTO public.ref_action (id, description, theme) VALUES('9c7f629b-7302-47c9-bd19-80789bd567f0', 'Accompagner la montée en compétences', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES('59b91892-4b85-433b-8d46-a29bc012fab7', 'Définir son marché, son produit, sa communication', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES('2ae53d4a-cea7-4ff1-9d3c-1dc596722338', 'Travailler la conformité réglementaire (de son entreprise)', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES('db813b3f-d1c4-43d0-b43f-3d78850b3b0f', 'Mettre en place une organisation efficace (de son entreprise)', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES('7b03843d-f977-4543-906d-0da7f0e1d779', 'Maîtriser l’aspect financier (de son entreprise)', 'emploi');
INSERT INTO public.ref_action (id, description, theme) VALUES('5fb58400-b8c1-47e3-964d-acc47f870db9', 'Candidater à une offre', 'emploi');

--
-- update migrations
--
UPDATE public.ref_situation SET description = 'Difficulté à accéder à un justificatif d''identité' WHERE theme='difficulte_administrative' AND description='Sans papiers d’identités, titre de séjour…';
UPDATE public.ref_situation SET description = 'Difficulté à accéder à son avis d’imposition' WHERE theme='difficulte_administrative' AND description='Sans avis d’imposition';
UPDATE public.ref_situation SET description = 'Sécurité sociale à mettre à jour' WHERE theme='difficulte_administrative' AND description='Pas de sécurité sociale à jour';
UPDATE public.ref_situation SET description = 'Ressources précaires' WHERE theme='difficulte_financiere' AND description='Ressources précaires ou ponctuelles';
UPDATE public.ref_situation SET description = 'Besoin d''un soutien alimentaire' WHERE theme='difficulte_financiere' AND description='Rupture alimentaire';
UPDATE public.ref_situation SET description = 'Indisponible pour un emploi dans l''immédiat' WHERE theme='emploi' AND description='Prêt mais pas pour n''importe quel emploi';
UPDATE public.ref_situation SET description = 'Prêt à suivre une formation' WHERE theme='formation' AND description='Prêt pour une formation';
UPDATE public.ref_situation SET description = 'Ne souhaite pas suivre une formation' WHERE theme='formation' AND description='Ne sais pas s''il est prêt';
UPDATE public.ref_situation SET description = 'Habitat mobile' WHERE theme='logement' AND description='Logement de fortune (caravane, mobile home...)';
UPDATE public.ref_situation SET description = 'Territoire rural isolé' WHERE theme='logement' AND description='Eloigné de tout';
UPDATE public.ref_situation SET description = 'Accès ou utilisation difficile des outils numériques' WHERE theme='maitrise_langue' AND description='Illectronisme';
UPDATE public.ref_situation SET description = 'Couverture sociale à mettre à jour' WHERE theme='sante' AND description='Absence de couverture / complémentaire sociale santé ( CSS, PUMa… )';

--
-- delete migrations
--
DELETE FROM public.ref_situation WHERE theme='difficulte_administrative' AND description='Autonome mais nécessitant d''être guidé dans le cadre d''un accès aux droits';
DELETE FROM public.ref_situation WHERE theme='difficulte_financiere' AND description='Incidents budgétaires ponctuels';
DELETE FROM public.ref_situation WHERE theme='difficulte_financiere' AND description='Inadéquation charges / ressources';
DELETE FROM public.ref_situation WHERE theme='emploi' AND description='Pas prêt pour un emploi';
DELETE FROM public.ref_situation WHERE theme='emploi' AND description='Ne sais pas s''il est prêt pour un emploi';
DELETE FROM public.ref_situation WHERE theme='emploi' AND description='En projet de profession libérale';
DELETE FROM public.ref_situation WHERE theme='formation' AND description='Prêt à en parler';
DELETE FROM public.ref_situation WHERE theme='formation' AND description='Prêt pour un accompagnement';
DELETE FROM public.ref_situation WHERE theme='logement' AND description='Autre';é
