CREATE OR REPLACE VIEW "public"."account_info" AS
 SELECT account.id AS account_id,
        CASE
            WHEN (account.beneficiary_id IS NOT NULL) THEN beneficiary.firstname
            WHEN (account.admin_id IS NOT NULL) THEN admin_cdb.firstname
            WHEN (account.professional_id IS NOT NULL) THEN professional.firstname
            WHEN (account.admin_structure_id IS NOT NULL) THEN admin_structure.firstname
            WHEN (account.manager_id IS NOT NULL) THEN manager.firstname
            WHEN (account.orientation_manager_id IS NOT NULL) THEN orientation_manager.firstname
            ELSE NULL::character varying
        END AS firstname,
        CASE
            WHEN (account.beneficiary_id IS NOT NULL) THEN beneficiary.lastname
            WHEN (account.admin_id IS NOT NULL) THEN admin_cdb.lastname
            WHEN (account.professional_id IS NOT NULL) THEN professional.lastname
            WHEN (account.admin_structure_id IS NOT NULL) THEN admin_structure.lastname
            WHEN (account.manager_id IS NOT NULL) THEN manager.lastname
            WHEN (account.orientation_manager_id IS NOT NULL) THEN orientation_manager.lastname
            ELSE NULL::character varying
        END AS lastname,
        CASE
            WHEN (account.beneficiary_id IS NOT NULL) THEN beneficiary.email
            WHEN (account.admin_id IS NOT NULL) THEN admin_cdb.email
            WHEN (account.professional_id IS NOT NULL) THEN professional.email
            WHEN (account.admin_structure_id IS NOT NULL) THEN admin_structure.email
            WHEN (account.manager_id IS NOT NULL) THEN (manager.email)::citext
            WHEN (account.orientation_manager_id IS NOT NULL) THEN orientation_manager.email
            ELSE NULL::citext
        END AS email
   FROM ((((((account
     LEFT JOIN beneficiary ON ((beneficiary.id = account.beneficiary_id)))
     LEFT JOIN admin_cdb ON ((admin_cdb.id = account.admin_id)))
     LEFT JOIN professional ON ((professional.id = account.professional_id)))
     LEFT JOIN admin_structure ON ((admin_structure.id = account.admin_structure_id)))
     LEFT JOIN manager ON ((manager.id = account.manager_id)))
     LEFT JOIN orientation_manager ON ((orientation_manager.id = account.orientation_manager_id)));
