update ref_situation set theme = 'difficulte_administrative'
where description = 'Absence d''adresse de messagerie'
or description = 'Absence d''équipement ou de connexion'
or description = 'Accès ou utilisation difficile des outils numériques';

with to_delete(description, theme) as (VALUES
  ('Travailler l’accès à une prestation', 'numerique'),
  ('Accompagnement dans les démarches numériques', 'numerique'),
  ('Mise en place d’une mesure d’accompagnement adapté', 'numerique'))
delete from ref_target where exists
  (select * from to_delete
   where ref_target.description = to_delete.description
   and ref_target.theme = to_delete.theme
  )
