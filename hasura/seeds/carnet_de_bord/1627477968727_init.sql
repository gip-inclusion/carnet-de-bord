DO language plpgsql $$
BEGIN
	RAISE NOTICE 'SEED %', now();
END
$$;

TRUNCATE public.admin_structure_structure CASCADE;
TRUNCATE public.beneficiary_structure CASCADE;
TRUNCATE public.structure CASCADE;

TRUNCATE public.notebook_focus CASCADE;
TRUNCATE public.notebook_target CASCADE;
TRUNCATE public.notebook_action CASCADE;
TRUNCATE public.notebook_event CASCADE;
TRUNCATE public.notebook_member CASCADE;

TRUNCATE public.admin_cdb CASCADE;
TRUNCATE public.manager CASCADE;
TRUNCATE public.admin_structure CASCADE;
TRUNCATE public.professional CASCADE;
TRUNCATE public.beneficiary CASCADE;
TRUNCATE public.notebook CASCADE;
TRUNCATE public.wanted_job CASCADE;
TRUNCATE public.deployment CASCADE;

TRUNCATE public.account CASCADE;

SET check_function_bodies = false;
INSERT INTO public.admin_cdb (id, email, firstname, lastname) VALUES ('a81bc81a-dead-4e5d-abff-90865d1e13b7', 'support.carnet-de-bord@fabrique.social.gouv.fr', 'Carnet de Bord', 'Administrateur');
INSERT INTO public.account (id, username, type, access_key, access_key_date, last_login, beneficiary_id, professional_id, admin_id, confirmed, onboarding_done) VALUES ('9eee9fea-bf3e-4eb8-8f43-d9b7fd6fae76', 'admin', 'admin_cdb', NULL, NULL, '2021-09-21 12:25:55.822+00', NULL, NULL, 'a81bc81a-dead-4e5d-abff-90865d1e13b7', true, false);
INSERT INTO public.deployment (id, label) VALUES ('4dab8036-a86e-4d5f-9bd4-6ce88c1940d0', 'expérimentation 93');
INSERT INTO public.deployment (id, label, config) VALUES ('c5c3a933-6f4a-4b2b-aa49-7a816eaef16b', 'expérimentation 51', '{"url": "http://localhost:3000/api/test", "headers": {"token":"azerty"}, "callback": "/api/marne" }');

INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('a81bc81b-dead-4e5d-abff-90865d1e13b2', NULL, 'Pole Emploi Agence Livry-Gargnan', 'Pole Emploi Agence Livry-Gargnan', '09 72 72 39 49', 'contact@pole-emploi.fr', '93190', 'Livry Gargan', '33 Bd Robert Schuman', NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('1c52e5ad-e0b9-48b9-a490-105a4effaaea', NULL, 'Centre Communal d''action social Livry-Gargan', '', '01 41 70 88 00', '', NULL, 'Saint Denis', '3 Pl. François Mitterrand', NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('e578237f-6167-4012-b457-7c4f36fb079d', NULL, 'Service Social Départemental', NULL, '01 71 29 43 80', NULL, '93800', 'Épinay-sur-Seine', ' 38 Av. Salvador Allende', NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('8b71184c-6479-4440-aa89-15da704cc792', NULL, 'Groupe NS', NULL, '01 87 97 36 45', NULL, '91300', 'Montreuil', '28 rue de Lorraine', NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('58d09cad-ed8c-4278-b449-e6673ae0fad4', NULL, 'Amélie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('e8d09cad-ed8c-4278-b449-e6673ae0fad4', NULL, 'Sécurité sociale', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('3b299bcb-445c-48db-bc61-e30cd52d65b6', NULL, 'AFPA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('dfaaa6e1-4c5a-4079-a191-e8611d573acf', NULL, 'Plateforme - Ma demande de logement social', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('dfaaa6e3-4c5a-4079-a191-e8611d573acf', NULL, 'Interlogement 93', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4dab8036-a86e-4d5f-9bd4-6ce88c1940d0');
INSERT INTO public.structure (id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id) VALUES ('c0b8aee3-c061-4023-b57e-92880627d589', NULL, 'Interlogement 51', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'c5c3a933-6f4a-4b2b-aa49-7a816eaef16b');
