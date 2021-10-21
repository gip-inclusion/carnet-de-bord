
--
-- deployment
--
CREATE TABLE public.deployment (
  id uuid DEFAULT public.gen_random_uuid() NOT NULL,
  label character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.deployment
  	IS 'list of carnet-de-bord deployments';

ALTER TABLE ONLY public.deployment
    ADD CONSTRAINT deployment_pkey PRIMARY KEY (id);

CREATE TRIGGER "set_public_deployment_updated_at"
BEFORE UPDATE ON "public"."deployment"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_deployment_updated_at" ON "public"."deployment"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

--
-- Manager
--

CREATE EXTENSION IF NOT EXISTS citext;
CREATE DOMAIN email AS citext
  CONSTRAINT custom_domain_email_check
  CHECK (value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$');

CREATE TABLE public.manager (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "email" email NOT NULL,
  "firstname" varchar NOT NULL,
  "lastname" varchar NOT NULL,
  "deployment_id" uuid,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE "public"."manager" IS E'A manager handle structure and professional for a given deployment';

CREATE TRIGGER "set_public_manager_updated_at"
BEFORE UPDATE ON "public"."manager"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_manager_updated_at" ON "public"."manager"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE ONLY public.manager
    ADD CONSTRAINT manager_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.manager
    ADD CONSTRAINT manager_deployment_id_fkey FOREIGN KEY (deployment_id) REFERENCES public.deployment(id) ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE "public"."account" add column "manager_id" uuid;
ALTER TABLE "public"."structure" add column "deployment_id" uuid;

ALTER TABLE ONLY public.structure
    ADD CONSTRAINT structure_deployment_id_fkey FOREIGN KEY (deployment_id) REFERENCES public.deployment(id) ON UPDATE RESTRICT ON DELETE SET NULL;
ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.manager(id) on update no action on delete no action;

--
-- admin : add created_at / updated_at
--
alter table "public"."admin" add column "created_at" timestamptz
 null default now();

alter table "public"."admin" add column "updated_at" timestamptz
 null default now();


CREATE TRIGGER "set_public_admin_updated_at"
BEFORE UPDATE ON "public"."admin"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_admin_updated_at" ON "public"."admin"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

