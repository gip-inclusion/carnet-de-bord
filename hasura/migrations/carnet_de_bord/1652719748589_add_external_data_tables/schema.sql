--
-- PostgreSQL database dump
--

-- Dumped from database version 11.15 (Debian 11.15-1.pgdg90+1)
-- Dumped by pg_dump version 14.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA hdb_catalog;


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: email; Type: DOMAIN; Schema: public; Owner: -
--

CREATE DOMAIN public.email AS public.citext
	CONSTRAINT custom_domain_email_check CHECK ((VALUE OPERATOR(public.~) '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'::public.citext));


--
-- Name: gen_hasura_uuid(); Type: FUNCTION; Schema: hdb_catalog; Owner: -
--

CREATE FUNCTION hdb_catalog.gen_hasura_uuid() RETURNS uuid
    LANGUAGE sql
    AS $$select gen_random_uuid()$$;


SET default_tablespace = '';

--
-- Name: notebook; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notebook (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    beneficiary_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    right_rsa character varying,
    right_rqth boolean DEFAULT false NOT NULL,
    right_are boolean DEFAULT false NOT NULL,
    right_ass boolean DEFAULT false,
    right_bonus boolean DEFAULT false NOT NULL,
    geographical_area character varying,
    education_level character varying,
    work_situation_date date,
    contract_type character varying,
    contract_sign_date date,
    work_situation character varying,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: nb_member(public.notebook); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.nb_member(notebook_row public.notebook) RETURNS bigint
    LANGUAGE sql STABLE
    AS $$
    SELECT count(*)
    FROM notebook_member A
    WHERE A.notebook_id = notebook_row.id
$$;


--
-- Name: notebook_action_modification_date(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notebook_action_modification_date() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  session_variables json;
  account uuid;
  notebook uuid;
  focus uuid;
BEGIN
  session_variables := current_setting('hasura.user', 't');
  IF session_variables IS NOT NULL then
    account := session_variables ->> 'x-hasura-user-id';
    IF account IS NOT NULL then
      SELECT focus_id into focus FROM public.notebook_target where id = NEW.target_id;
      SELECT notebook_id into notebook FROM public.notebook_focus where id = focus;
      UPDATE notebook_member SET last_modified_at=now() WHERE notebook_id=notebook AND account_id = account;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: notebook_focus_modification_date(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notebook_focus_modification_date() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  session_variables json;
  account uuid;
BEGIN
  session_variables := current_setting('hasura.user', 't');
  IF session_variables IS NOT NULL then
    account := session_variables ->> 'x-hasura-user-id';
    IF account IS NOT NULL then
      UPDATE notebook_member SET last_modified_at=now() WHERE notebook_id=NEW.notebook_id AND account_id = account;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: notebook_modification_date(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notebook_modification_date() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  session_variables json;
  account uuid;
BEGIN
  session_variables := current_setting('hasura.user', 't');
  IF session_variables IS NOT NULL then
    account := session_variables ->> 'x-hasura-user-id';
    IF account IS NOT NULL then
      UPDATE notebook_member SET last_modified_at=now() WHERE notebook_id=NEW.id AND account_id = account;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: notebook_target_modification_date(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notebook_target_modification_date() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  session_variables json;
  account uuid;
  notebook uuid;
BEGIN
  session_variables := current_setting('hasura.user', 't');
  IF session_variables IS NOT NULL then
    account := session_variables ->> 'x-hasura-user-id';
    IF account IS NOT NULL then
      SELECT focus.notebook_id into notebook FROM public.notebook_focus as focus where focus.id = NEW.focus_id;
      UPDATE notebook_member SET last_modified_at=now() WHERE notebook_id=notebook AND account_id = account;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: record_notebook_action_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.record_notebook_action_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  new_notebook_id uuid;
  focus_theme text;
BEGIN

  SELECT notebook_focus.notebook_id, notebook_focus.theme
  INTO new_notebook_id, focus_theme
  FROM notebook_focus, notebook_target
  WHERE notebook_focus.id = notebook_target.focus_id
  AND notebook_target.id = NEW.target_id;

  INSERT INTO notebook_event
  (notebook_id, event_date, creator_id, event, event_type)
  VALUES
  (new_notebook_id, now(), NEW.creator_id, ('{ "category": "' || focus_theme || '", "status": "' || NEW.status || '", "event_label": "' || NEW.action || '"}')::jsonb, 'action');
  RETURN NEW;
END;
$$;


--
-- Name: record_notebook_target_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.record_notebook_target_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  new_notebook_id uuid;
  focus_theme text;
BEGIN

  SELECT notebook_focus.notebook_id, notebook_focus.theme
  INTO new_notebook_id, focus_theme
  FROM notebook_focus
  WHERE notebook_focus.id = NEW.focus_id;

  INSERT INTO notebook_event
  (notebook_id, event_date, creator_id, event, event_type)
  VALUES
  (new_notebook_id, now(), NEW.creator_id, ('{ "category": "' || focus_theme || '", "status": "' || NEW.status || '", "event_label": "' || NEW.target || '"}')::jsonb, 'target');
  RETURN NEW;
END;
$$;


--
-- Name: beneficiary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.beneficiary (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    email public.citext,
    lastname character varying(255) NOT NULL,
    firstname character varying(255) NOT NULL,
    caf_number character varying(255),
    pe_number character varying(255),
    postal_code character varying(255),
    city character varying(255),
    address1 character varying(255),
    address2 character varying(255),
    mobile_number character varying(255),
    date_of_birth date NOT NULL,
    deployment_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    internal_id text,
    place_of_birth character varying
);


--
-- Name: search_beneficiaries(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.search_beneficiaries(search text) RETURNS SETOF public.beneficiary
    LANGUAGE sql STABLE
    AS $$
	SELECT
			*
	FROM
			beneficiary
	WHERE
			search = ''
			OR unaccent(search) <% lastname
			OR search <% pe_number
			OR search <% caf_number
			OR search <% mobile_number
$$;


--
-- Name: notebook_member; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notebook_member (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    notebook_id uuid NOT NULL,
    account_id uuid NOT NULL,
    last_visited_at timestamp with time zone,
    member_type character varying NOT NULL,
    last_modified_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    creator_id uuid,
    invitation_sent_at timestamp with time zone,
    active boolean DEFAULT true
);


--
-- Name: search_notebook_members(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.search_notebook_members(search text) RETURNS SETOF public.notebook_member
    LANGUAGE sql STABLE
    AS $$
  SELECT notebook_member.*
  FROM notebook_member
  JOIN notebook ON notebook.id = notebook_member.notebook_id
  JOIN beneficiary ON beneficiary.id = notebook.beneficiary_id
  WHERE
      search = ''
      OR unaccent(search) <% beneficiary.lastname
      OR search <% beneficiary.pe_number
      OR search <% beneficiary.caf_number
      OR search <% beneficiary.mobile_number
$$;


--
-- Name: rome_code; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rome_code (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    code text NOT NULL,
    description text NOT NULL,
    label text NOT NULL
);


--
-- Name: search_rome_codes(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.search_rome_codes(search text) RETURNS SETOF public.rome_code
    LANGUAGE sql STABLE
    AS $$
  SELECT *
  FROM rome_code
  WHERE
    unaccent(search) <% label
  ORDER BY unaccent(search) <<-> label ASC
$$;


--
-- Name: set_current_timestamp_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;


--
-- Name: hdb_action_log; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_action_log (
    id uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    action_name text,
    input_payload jsonb NOT NULL,
    request_headers jsonb NOT NULL,
    session_variables jsonb NOT NULL,
    response_payload jsonb,
    errors jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    response_received_at timestamp with time zone,
    status text NOT NULL,
    CONSTRAINT hdb_action_log_status_check CHECK ((status = ANY (ARRAY['created'::text, 'processing'::text, 'completed'::text, 'error'::text])))
);


--
-- Name: hdb_cron_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_cron_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: hdb_cron_events; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_cron_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    trigger_name text NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


--
-- Name: hdb_metadata; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_metadata (
    id integer NOT NULL,
    metadata json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL
);


--
-- Name: hdb_scheduled_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_scheduled_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: hdb_scheduled_events; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_scheduled_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    webhook_conf json NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    retry_conf json,
    payload json,
    header_conf json,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    comment text,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


--
-- Name: hdb_schema_notifications; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_schema_notifications (
    id integer NOT NULL,
    notification json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL,
    instance_id uuid NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT hdb_schema_notifications_id_check CHECK ((id = 1))
);


--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    username character varying(255) DEFAULT public.gen_random_uuid() NOT NULL,
    type character varying(255) NOT NULL,
    access_key character varying(255),
    access_key_date timestamp with time zone,
    last_login timestamp with time zone,
    beneficiary_id uuid,
    professional_id uuid,
    admin_id uuid,
    confirmed boolean DEFAULT false NOT NULL,
    onboarding_done boolean DEFAULT false,
    manager_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    admin_structure_id uuid,
    CONSTRAINT "Account must be linked to a profile of the right type" CHECK (((((type)::text = 'manager'::text) AND (manager_id IS NOT NULL)) OR (((type)::text = 'beneficiary'::text) AND (beneficiary_id IS NOT NULL)) OR (((type)::text = 'professional'::text) AND (professional_id IS NOT NULL)) OR (((type)::text = 'admin_cdb'::text) AND (admin_id IS NOT NULL)) OR (((type)::text = 'admin_structure'::text) AND (admin_structure_id IS NOT NULL))))
);


--
-- Name: admin_cdb; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_cdb (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    email public.citext NOT NULL,
    firstname character varying NOT NULL,
    lastname character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: admin_structure; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_structure (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    firstname character varying,
    lastname character varying,
    email public.citext NOT NULL,
    phone_numbers character varying,
    "position" character varying,
    deployment_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE admin_structure; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.admin_structure IS 'Table of structure manager, handle pro and brsa attachment';


--
-- Name: admin_structure_structure; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_structure_structure (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    admin_structure_id uuid NOT NULL,
    structure_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE admin_structure_structure; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.admin_structure_structure IS 'associative table between admin_structure and structure (many ot many)';


--
-- Name: beneficiary_structure; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.beneficiary_structure (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    beneficiary_id uuid NOT NULL,
    structure_id uuid NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    data jsonb DEFAULT jsonb_build_object() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE beneficiary_structure; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.beneficiary_structure IS 'associative table between beneficiary and structure (many ot many)';


--
-- Name: deployment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deployment (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    label character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    config jsonb
);


--
-- Name: TABLE deployment; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.deployment IS 'list of carnet-de-bord deployments';


--
-- Name: external_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.external_data (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    source text NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: external_data_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.external_data_info (
    beneficiary_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    external_data_id uuid NOT NULL
);


--
-- Name: external_source; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.external_source (
    value text NOT NULL,
    comment text NOT NULL
);


--
-- Name: manager; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.manager (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    email public.email NOT NULL,
    firstname character varying,
    lastname character varying,
    deployment_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE manager; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.manager IS 'A manager handle structure and professional for a given deployment';


--
-- Name: notebook_action; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notebook_action (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    action character varying NOT NULL,
    target_id uuid NOT NULL,
    status character varying DEFAULT 'in_progress'::character varying NOT NULL,
    creator_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    initial_id character varying
);


--
-- Name: notebook_event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notebook_event (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    notebook_id uuid NOT NULL,
    creation_date timestamp with time zone DEFAULT now() NOT NULL,
    event_date timestamp with time zone NOT NULL,
    creator_id uuid NOT NULL,
    event jsonb NOT NULL,
    event_type text NOT NULL
);


--
-- Name: notebook_event_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notebook_event_type (
    value text NOT NULL,
    comment text NOT NULL
);


--
-- Name: notebook_focus; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notebook_focus (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    theme character varying NOT NULL,
    situations jsonb,
    creator_id uuid NOT NULL,
    notebook_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    linked_to character varying,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: notebook_target; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notebook_target (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    focus_id uuid NOT NULL,
    target character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    creator_id uuid NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    status character varying DEFAULT 'in_progress'::character varying NOT NULL
);


--
-- Name: professional; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.professional (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    structure_id uuid NOT NULL,
    email public.citext NOT NULL,
    lastname character varying(255) NOT NULL,
    firstname character varying(255) NOT NULL,
    "position" text,
    mobile_number character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ref_action; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ref_action (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    description character varying NOT NULL,
    theme character varying DEFAULT 'none'::character varying NOT NULL
);


--
-- Name: ref_situation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ref_situation (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    description character varying NOT NULL,
    theme character varying NOT NULL
);


--
-- Name: ref_target; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ref_target (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    description character varying NOT NULL,
    theme character varying NOT NULL
);


--
-- Name: structure; Type: TABLE; Schema: public; Owner: -
--

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
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    website character varying,
    deployment_id uuid
);


--
-- Name: wanted_job; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wanted_job (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    notebook_id uuid NOT NULL,
    rome_code_id uuid NOT NULL
);


--
-- Name: TABLE wanted_job; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.wanted_job IS 'Stores the jobs wanted for a notebook beneficiary';


--
-- Name: hdb_action_log hdb_action_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_action_log
    ADD CONSTRAINT hdb_action_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_events hdb_cron_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_events
    ADD CONSTRAINT hdb_cron_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_resource_version_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_resource_version_key UNIQUE (resource_version);


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_scheduled_events hdb_scheduled_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_events
    ADD CONSTRAINT hdb_scheduled_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_schema_notifications hdb_schema_notifications_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_schema_notifications
    ADD CONSTRAINT hdb_schema_notifications_pkey PRIMARY KEY (id);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- Name: account account_admin_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_admin_id_key UNIQUE (admin_id);


--
-- Name: account account_admin_structure_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_admin_structure_id_key UNIQUE (admin_structure_id);


--
-- Name: account account_beneficiary_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_beneficiary_id_key UNIQUE (beneficiary_id);


--
-- Name: account account_manager_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_manager_id_key UNIQUE (manager_id);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: account account_professional_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_professional_id_key UNIQUE (professional_id);


--
-- Name: account account_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_username_unique UNIQUE (username);


--
-- Name: admin_cdb admin_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_cdb
    ADD CONSTRAINT admin_email_unique UNIQUE (email);


--
-- Name: admin_cdb admin_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_cdb
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: admin_structure admin_structure_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_structure
    ADD CONSTRAINT admin_structure_email_key UNIQUE (email);


--
-- Name: admin_structure admin_structure_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_structure
    ADD CONSTRAINT admin_structure_pkey PRIMARY KEY (id);


--
-- Name: admin_structure_structure admin_structure_structure_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_structure_structure
    ADD CONSTRAINT admin_structure_structure_pkey PRIMARY KEY (id);


--
-- Name: beneficiary beneficiary_firstname_caf_number_date_of_birth_lastname_deploym; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.beneficiary
    ADD CONSTRAINT beneficiary_firstname_caf_number_date_of_birth_lastname_deploym UNIQUE (firstname, caf_number, date_of_birth, lastname, deployment_id);


--
-- Name: beneficiary beneficiary_internal_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.beneficiary
    ADD CONSTRAINT beneficiary_internal_id_key UNIQUE (internal_id);


--
-- Name: beneficiary beneficiary_pe_number_lastname_firstname_date_of_birth_deployme; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.beneficiary
    ADD CONSTRAINT beneficiary_pe_number_lastname_firstname_date_of_birth_deployme UNIQUE (pe_number, lastname, firstname, date_of_birth, deployment_id);


--
-- Name: beneficiary beneficiary_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.beneficiary
    ADD CONSTRAINT beneficiary_pkey PRIMARY KEY (id);


--
-- Name: beneficiary_structure beneficiary_structure_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.beneficiary_structure
    ADD CONSTRAINT beneficiary_structure_pkey PRIMARY KEY (id);


--
-- Name: beneficiary_structure beneficiary_structure_structure_id_beneficiary_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.beneficiary_structure
    ADD CONSTRAINT beneficiary_structure_structure_id_beneficiary_id_key UNIQUE (structure_id, beneficiary_id);


--
-- Name: deployment deployment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deployment
    ADD CONSTRAINT deployment_pkey PRIMARY KEY (id);


--
-- Name: external_data_info external_data_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.external_data_info
    ADD CONSTRAINT external_data_info_pkey PRIMARY KEY (external_data_id);


--
-- Name: external_data external_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.external_data
    ADD CONSTRAINT external_data_pkey PRIMARY KEY (id);


--
-- Name: external_source external_source_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.external_source
    ADD CONSTRAINT external_source_pkey PRIMARY KEY (value);


--
-- Name: manager manager_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manager
    ADD CONSTRAINT manager_email_key UNIQUE (email);


--
-- Name: manager manager_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manager
    ADD CONSTRAINT manager_pkey PRIMARY KEY (id);


--
-- Name: notebook_action notebook_action_initial_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_action
    ADD CONSTRAINT notebook_action_initial_id_key UNIQUE (initial_id);


--
-- Name: notebook_action notebook_action_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_action
    ADD CONSTRAINT notebook_action_pkey PRIMARY KEY (id);


--
-- Name: notebook_action notebook_action_target_id_action_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_action
    ADD CONSTRAINT notebook_action_target_id_action_key UNIQUE (target_id, action);


--
-- Name: notebook notebook_beneficiary_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook
    ADD CONSTRAINT notebook_beneficiary_id_key UNIQUE (beneficiary_id);


--
-- Name: notebook_event notebook_event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_event
    ADD CONSTRAINT notebook_event_pkey PRIMARY KEY (id);


--
-- Name: notebook_event_type notebook_event_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_event_type
    ADD CONSTRAINT notebook_event_type_pkey PRIMARY KEY (value);


--
-- Name: notebook_focus notebook_focus_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_focus
    ADD CONSTRAINT notebook_focus_pkey PRIMARY KEY (id);


--
-- Name: notebook_member notebook_member_notebook_id_account_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_member
    ADD CONSTRAINT notebook_member_notebook_id_account_id_key UNIQUE (notebook_id, account_id);


--
-- Name: notebook_member notebook_member_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_member
    ADD CONSTRAINT notebook_member_pkey PRIMARY KEY (id);


--
-- Name: notebook notebook_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook
    ADD CONSTRAINT notebook_pkey PRIMARY KEY (id);


--
-- Name: notebook_target notebook_target_focus_id_target_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_target
    ADD CONSTRAINT notebook_target_focus_id_target_key UNIQUE (focus_id, target);


--
-- Name: notebook_target notebook_target_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_target
    ADD CONSTRAINT notebook_target_pkey PRIMARY KEY (id);


--
-- Name: professional professional_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.professional
    ADD CONSTRAINT professional_email_unique UNIQUE (email);


--
-- Name: professional professional_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.professional
    ADD CONSTRAINT professional_pkey PRIMARY KEY (id);


--
-- Name: ref_action ref_action_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ref_action
    ADD CONSTRAINT ref_action_pkey PRIMARY KEY (id);


--
-- Name: ref_situation ref_situation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ref_situation
    ADD CONSTRAINT ref_situation_pkey PRIMARY KEY (id);


--
-- Name: ref_target ref_target_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ref_target
    ADD CONSTRAINT ref_target_pkey PRIMARY KEY (id);


--
-- Name: rome_code rome_codes_label_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rome_code
    ADD CONSTRAINT rome_codes_label_key UNIQUE (label);


--
-- Name: rome_code rome_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rome_code
    ADD CONSTRAINT rome_codes_pkey PRIMARY KEY (id);


--
-- Name: structure structure_name_deployment_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.structure
    ADD CONSTRAINT structure_name_deployment_id_key UNIQUE (name, deployment_id);


--
-- Name: structure structure_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.structure
    ADD CONSTRAINT structure_pkey PRIMARY KEY (id);


--
-- Name: wanted_job wanted_job_notebook_id_rome_code_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wanted_job
    ADD CONSTRAINT wanted_job_notebook_id_rome_code_id_key UNIQUE (notebook_id, rome_code_id);


--
-- Name: wanted_job wanted_job_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wanted_job
    ADD CONSTRAINT wanted_job_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_event_invocation_event_id; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX hdb_cron_event_invocation_event_id ON hdb_catalog.hdb_cron_event_invocation_logs USING btree (event_id);


--
-- Name: hdb_cron_event_status; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX hdb_cron_event_status ON hdb_catalog.hdb_cron_events USING btree (status);


--
-- Name: hdb_cron_events_unique_scheduled; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE UNIQUE INDEX hdb_cron_events_unique_scheduled ON hdb_catalog.hdb_cron_events USING btree (trigger_name, scheduled_time) WHERE (status = 'scheduled'::text);


--
-- Name: hdb_scheduled_event_status; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX hdb_scheduled_event_status ON hdb_catalog.hdb_scheduled_events USING btree (status);


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: notebook_action record_notebook_action_event_init_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER record_notebook_action_event_init_trigger AFTER INSERT ON public.notebook_action FOR EACH ROW EXECUTE PROCEDURE public.record_notebook_action_event();


--
-- Name: notebook_action record_notebook_action_event_update_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER record_notebook_action_event_update_trigger AFTER UPDATE ON public.notebook_action FOR EACH ROW WHEN (((old.status)::text IS DISTINCT FROM (new.status)::text)) EXECUTE PROCEDURE public.record_notebook_action_event();


--
-- Name: notebook_target record_notebook_target_event_init_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER record_notebook_target_event_init_trigger AFTER INSERT ON public.notebook_target FOR EACH ROW EXECUTE PROCEDURE public.record_notebook_target_event();


--
-- Name: notebook_target record_notebook_target_event_update_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER record_notebook_target_event_update_trigger AFTER UPDATE ON public.notebook_target FOR EACH ROW WHEN (((old.status)::text IS DISTINCT FROM (new.status)::text)) EXECUTE PROCEDURE public.record_notebook_target_event();


--
-- Name: notebook_action set_notebook_action_modification_date; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_notebook_action_modification_date AFTER INSERT OR UPDATE ON public.notebook_action FOR EACH ROW EXECUTE PROCEDURE public.notebook_action_modification_date();


--
-- Name: notebook_focus set_notebook_focus_modification_date; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_notebook_focus_modification_date AFTER INSERT OR UPDATE ON public.notebook_focus FOR EACH ROW EXECUTE PROCEDURE public.notebook_focus_modification_date();


--
-- Name: notebook set_notebook_modification_date; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_notebook_modification_date AFTER UPDATE ON public.notebook FOR EACH ROW EXECUTE PROCEDURE public.notebook_modification_date();


--
-- Name: notebook_target set_notebook_target_modification_date; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_notebook_target_modification_date AFTER INSERT OR UPDATE ON public.notebook_target FOR EACH ROW EXECUTE PROCEDURE public.notebook_target_modification_date();


--
-- Name: account set_public_account_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_account_updated_at BEFORE UPDATE ON public.account FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_account_updated_at ON account; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_account_updated_at ON public.account IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: admin_cdb set_public_admin_cdb_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_admin_cdb_updated_at BEFORE UPDATE ON public.admin_cdb FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_admin_cdb_updated_at ON admin_cdb; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_admin_cdb_updated_at ON public.admin_cdb IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: admin_structure set_public_admin_structure_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_admin_structure_updated_at BEFORE UPDATE ON public.admin_structure FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_admin_structure_updated_at ON admin_structure; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_admin_structure_updated_at ON public.admin_structure IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: beneficiary_structure set_public_beneficiary_structure_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_beneficiary_structure_updated_at BEFORE UPDATE ON public.beneficiary_structure FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_beneficiary_structure_updated_at ON beneficiary_structure; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_beneficiary_structure_updated_at ON public.beneficiary_structure IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: beneficiary set_public_beneficiary_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_beneficiary_updated_at BEFORE UPDATE ON public.beneficiary FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_beneficiary_updated_at ON beneficiary; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_beneficiary_updated_at ON public.beneficiary IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: deployment set_public_deployment_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_deployment_updated_at BEFORE UPDATE ON public.deployment FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_deployment_updated_at ON deployment; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_deployment_updated_at ON public.deployment IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: external_data_info set_public_external_data_info_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_external_data_info_updated_at BEFORE UPDATE ON public.external_data_info FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_external_data_info_updated_at ON external_data_info; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_external_data_info_updated_at ON public.external_data_info IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: external_data set_public_external_data_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_external_data_updated_at BEFORE UPDATE ON public.external_data FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_external_data_updated_at ON external_data; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_external_data_updated_at ON public.external_data IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: manager set_public_manager_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_manager_updated_at BEFORE UPDATE ON public.manager FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_manager_updated_at ON manager; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_manager_updated_at ON public.manager IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: notebook_action set_public_notebook_action_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_notebook_action_updated_at BEFORE UPDATE ON public.notebook_action FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_notebook_action_updated_at ON notebook_action; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_notebook_action_updated_at ON public.notebook_action IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: notebook_focus set_public_notebook_focus_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_notebook_focus_updated_at BEFORE UPDATE ON public.notebook_focus FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_notebook_focus_updated_at ON notebook_focus; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_notebook_focus_updated_at ON public.notebook_focus IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: notebook_target set_public_notebook_target_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_notebook_target_updated_at BEFORE UPDATE ON public.notebook_target FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_notebook_target_updated_at ON notebook_target; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_notebook_target_updated_at ON public.notebook_target IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: notebook set_public_notebook_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_notebook_updated_at BEFORE UPDATE ON public.notebook FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_notebook_updated_at ON notebook; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_notebook_updated_at ON public.notebook IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: professional set_public_professional_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_professional_updated_at BEFORE UPDATE ON public.professional FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_professional_updated_at ON professional; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_professional_updated_at ON public.professional IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: structure set_public_structure_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_structure_updated_at BEFORE UPDATE ON public.structure FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_structure_updated_at ON structure; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_structure_updated_at ON public.structure IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_cron_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_scheduled_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: account account_admin_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_admin_id_foreign FOREIGN KEY (admin_id) REFERENCES public.admin_cdb(id);


--
-- Name: account account_admin_structure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_admin_structure_id_fkey FOREIGN KEY (admin_structure_id) REFERENCES public.admin_structure(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: account account_beneficiary_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_beneficiary_id_foreign FOREIGN KEY (beneficiary_id) REFERENCES public.beneficiary(id);


--
-- Name: account account_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.manager(id);


--
-- Name: account account_professional_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_professional_id_foreign FOREIGN KEY (professional_id) REFERENCES public.professional(id);


--
-- Name: admin_structure admin_structure_deployment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_structure
    ADD CONSTRAINT admin_structure_deployment_id_fkey FOREIGN KEY (deployment_id) REFERENCES public.deployment(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: admin_structure_structure admin_structure_structure_admin_structure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_structure_structure
    ADD CONSTRAINT admin_structure_structure_admin_structure_id_fkey FOREIGN KEY (admin_structure_id) REFERENCES public.admin_structure(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: admin_structure_structure admin_structure_structure_structure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_structure_structure
    ADD CONSTRAINT admin_structure_structure_structure_id_fkey FOREIGN KEY (structure_id) REFERENCES public.structure(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: beneficiary beneficiary_deployment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.beneficiary
    ADD CONSTRAINT beneficiary_deployment_id_fkey FOREIGN KEY (deployment_id) REFERENCES public.deployment(id) ON UPDATE SET NULL ON DELETE SET NULL;


--
-- Name: beneficiary_structure beneficiary_structure_beneficiary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.beneficiary_structure
    ADD CONSTRAINT beneficiary_structure_beneficiary_id_fkey FOREIGN KEY (beneficiary_id) REFERENCES public.beneficiary(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: beneficiary_structure beneficiary_structure_structure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.beneficiary_structure
    ADD CONSTRAINT beneficiary_structure_structure_id_fkey FOREIGN KEY (structure_id) REFERENCES public.structure(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: external_data_info external_data_info_beneficiary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.external_data_info
    ADD CONSTRAINT external_data_info_beneficiary_id_fkey FOREIGN KEY (beneficiary_id) REFERENCES public.beneficiary(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: external_data_info external_data_info_external_data_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.external_data_info
    ADD CONSTRAINT external_data_info_external_data_id_fkey FOREIGN KEY (external_data_id) REFERENCES public.external_data(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: external_data external_data_source_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.external_data
    ADD CONSTRAINT external_data_source_fkey FOREIGN KEY (source) REFERENCES public.external_source(value) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: manager manager_deployment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manager
    ADD CONSTRAINT manager_deployment_id_fkey FOREIGN KEY (deployment_id) REFERENCES public.deployment(id) ON UPDATE RESTRICT ON DELETE SET NULL;


--
-- Name: notebook_action notebook_action_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_action
    ADD CONSTRAINT notebook_action_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.account(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: notebook_action notebook_action_target_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_action
    ADD CONSTRAINT notebook_action_target_id_fkey FOREIGN KEY (target_id) REFERENCES public.notebook_target(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: notebook notebook_beneficiary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook
    ADD CONSTRAINT notebook_beneficiary_id_fkey FOREIGN KEY (beneficiary_id) REFERENCES public.beneficiary(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: notebook_event notebook_event_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_event
    ADD CONSTRAINT notebook_event_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.account(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: notebook_event notebook_event_event_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_event
    ADD CONSTRAINT notebook_event_event_type_fkey FOREIGN KEY (event_type) REFERENCES public.notebook_event_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: notebook_event notebook_event_notebook_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_event
    ADD CONSTRAINT notebook_event_notebook_id_fkey FOREIGN KEY (notebook_id) REFERENCES public.notebook(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: notebook_focus notebook_focus_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_focus
    ADD CONSTRAINT notebook_focus_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.account(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: notebook_focus notebook_focus_notebook_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_focus
    ADD CONSTRAINT notebook_focus_notebook_id_fkey FOREIGN KEY (notebook_id) REFERENCES public.notebook(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: notebook_member notebook_member_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_member
    ADD CONSTRAINT notebook_member_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: notebook_member notebook_member_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_member
    ADD CONSTRAINT notebook_member_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.account(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: notebook_member notebook_member_notebook_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_member
    ADD CONSTRAINT notebook_member_notebook_id_fkey FOREIGN KEY (notebook_id) REFERENCES public.notebook(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: notebook_target notebook_target_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_target
    ADD CONSTRAINT notebook_target_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.account(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: notebook_target notebook_target_focus_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notebook_target
    ADD CONSTRAINT notebook_target_focus_id_fkey FOREIGN KEY (focus_id) REFERENCES public.notebook_focus(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: professional professional_structure_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.professional
    ADD CONSTRAINT professional_structure_id_foreign FOREIGN KEY (structure_id) REFERENCES public.structure(id);


--
-- Name: structure structure_deployment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.structure
    ADD CONSTRAINT structure_deployment_id_fkey FOREIGN KEY (deployment_id) REFERENCES public.deployment(id) ON UPDATE SET NULL ON DELETE SET NULL;


--
-- Name: wanted_job wanted_job_notebook_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wanted_job
    ADD CONSTRAINT wanted_job_notebook_id_fkey FOREIGN KEY (notebook_id) REFERENCES public.notebook(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: wanted_job wanted_job_rome_code_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wanted_job
    ADD CONSTRAINT wanted_job_rome_code_id_fkey FOREIGN KEY (rome_code_id) REFERENCES public.rome_code(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--
