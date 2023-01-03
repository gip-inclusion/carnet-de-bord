update ref_situation set theme = 'numerique'
where description = 'Absence d''adresse de messagerie'
or description = 'Absence d''équipement ou de connexion'
or description = 'Accès ou utilisation difficile des outils numériques';

insert into ref_target(description, theme) values
('Travailler l’accès à une prestation', 'numerique'),
('Accompagnement dans les démarches numériques', 'numerique'),
('Mise en place d''une mesure d''accompagnement adapté', 'numerique')
