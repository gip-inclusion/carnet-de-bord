
CREATE TABLE "public"."deployment" (
	"id" uuid DEFAULT public.gen_random_uuid() NOT NULL,
	"label" varchar NOT NULL,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY ("id")
);
COMMENT ON TABLE "public"."deployment" IS E'list of carnet-de-bord deployments';

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "set_public_deployment_updated_at"
BEFORE UPDATE ON "public"."deployment"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_deployment_updated_at" ON "public"."deployment"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

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

alter table "public"."account" add column "manager_id" uuid
 null;

alter table "public"."account"
  add constraint "account_manager_id_fkey"
  foreign key ("manager_id")
  references "public"."manager"
  ("id") on update no action on delete no action;

alter table "public"."beneficiary" add column "deployment_id" uuid
 null;

alter table "public"."beneficiary"
  add constraint "beneficiary_deployment_id_fkey"
  foreign key ("deployment_id")
  references "public"."deployment"
  ("id") on update set null on delete set null;;

alter table "public"."structure" add column "deployment_id" uuid
 null;

alter table "public"."structure"
  add constraint "structure_deployment_id_fkey"
  foreign key ("deployment_id")
  references "public"."deployment"
  ("id") on update set null on delete set null;
