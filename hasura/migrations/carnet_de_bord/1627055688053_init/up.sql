SET check_function_bodies = false;
CREATE TABLE public.account (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    username character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    access_key character varying(255),
    access_key_date timestamp with time zone,
    last_login timestamp with time zone,
    beneficiary_id uuid,
    professional_id uuid,
    admin_id uuid
);
CREATE TABLE public.admin (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL
);
CREATE TABLE public.beneficiary (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    lastname character varying(255) NOT NULL,
    firstname character varying(255) NOT NULL,
    caf_number character varying(255),
    pe_number character varying(255),
    postal_code character varying(255),
    city character varying(255),
    address1 character varying(255),
    address2 character varying(255),
    mobile_number character varying(255),
    date_of_birth date NOT NULL
);
CREATE TABLE public.professional (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    structure_id uuid NOT NULL,
    email character varying(255) NOT NULL,
    lastname character varying(255) NOT NULL,
    firstname character varying(255) NOT NULL
);
CREATE TABLE public.structure (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    siret character varying(255),
    name character varying(255),
    short_desc text,
    phone character varying(255),
    email character varying(255),
    postal_code character varying(255),
    city character varying(255),
    address1 character varying(255),
    address2 character varying(255),
    creation_date timestamp with time zone,
    modification_date timestamp with time zone
);
CREATE TABLE public.team_member (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    beneficiary_id uuid NOT NULL,
    professional_id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    member_type character varying NOT NULL,
    last_seen_date timestamp with time zone,
    modification_date timestamp with time zone
);
ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_username_unique UNIQUE (username);
ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_email_unique UNIQUE (email);
ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.beneficiary
    ADD CONSTRAINT beneficiary_email_unique UNIQUE (email);
ALTER TABLE ONLY public.beneficiary
    ADD CONSTRAINT beneficiary_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.professional
    ADD CONSTRAINT professional_email_unique UNIQUE (email);
ALTER TABLE ONLY public.professional
    ADD CONSTRAINT professional_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.structure
    ADD CONSTRAINT structure_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT team_member_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_admin_id_foreign FOREIGN KEY (admin_id) REFERENCES public.admin(id);
ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_beneficiary_id_foreign FOREIGN KEY (beneficiary_id) REFERENCES public.beneficiary(id);
ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_professional_id_foreign FOREIGN KEY (professional_id) REFERENCES public.professional(id);
ALTER TABLE ONLY public.professional
    ADD CONSTRAINT professional_structure_id_foreign FOREIGN KEY (structure_id) REFERENCES public.structure(id);
ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT team_member_beneficiary_id_fkey FOREIGN KEY (beneficiary_id) REFERENCES public.beneficiary(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT team_member_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES public.professional(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
