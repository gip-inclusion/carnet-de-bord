
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
