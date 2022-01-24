
CREATE TABLE "public"."waiting_supervision" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "beneficiary_id" uuid NOT NULL, "structure_id" uuid NOT NULL, "deployment_id" uuid NOT NULL, "status" Text NOT NULL, "additional_data" jsonb NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("beneficiary_id") REFERENCES "public"."beneficiary"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("structure_id") REFERENCES "public"."structure"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("deployment_id") REFERENCES "public"."deployment"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("beneficiary_id", "structure_id", "deployment_id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."notebook_member" add column "status" text
 not null default 'ACTIVE';

alter table "public"."notebook_member" drop column "status" cascade;

alter table "public"."waiting_supervision" add column "created_at" timestamptz
 not null default now();

alter table "public"."waiting_supervision" add column "updated_at" timestamptz
 not null default now();

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
CREATE TRIGGER "set_public_waiting_supervision_updated_at"
BEFORE UPDATE ON "public"."waiting_supervision"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_waiting_supervision_updated_at" ON "public"."waiting_supervision" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."waiting_supervision" add column "created_by" uuid
 not null;

alter table "public"."waiting_supervision"
  add constraint "waiting_supervision_created_by_fkey"
  foreign key ("created_by")
  references "public"."manager"
  ("id") on update restrict on delete restrict;

CREATE TABLE "public"."notebook_member_history" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "notebook_member_id" uuid NOT NULL, "ended_at" Timestamp, "status" text NOT NULL DEFAULT 'ACTIVE', PRIMARY KEY ("id") , FOREIGN KEY ("notebook_member_id") REFERENCES "public"."notebook_member"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
