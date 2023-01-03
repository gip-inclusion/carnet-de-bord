update ref_situation set theme = 'difficulte_administrative'
where description = 'Absence d''adresse de messagerie'
or description = 'Absence d''équipement ou de connexion'
or description = 'Accès ou utilisation difficile des outils numériques';
