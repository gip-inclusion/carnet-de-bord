CREATE TABLE "public"."notebook_appointment" (
	"id" uuid NOT NULL DEFAULT gen_random_uuid(),
	"notebook_id" uuid NOT NULL,
	"account_id" UUID NOT NULL,
	"date" date NOT NULL,
	"status" text NOT NULL,
	PRIMARY KEY ("id") ,
	FOREIGN KEY ("notebook_id") REFERENCES "public"."notebook"("id") ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON UPDATE restrict ON DELETE restrict
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."notebook_appointment" add column "created_at" timestamptz
 null default now();

alter table "public"."notebook_appointment" add column "updated_at" timestamptz
 null default now();

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
CREATE TRIGGER "set_public_notebook_appointment_updated_at"
BEFORE UPDATE ON "public"."notebook_appointment"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notebook_appointment_updated_at" ON "public"."notebook_appointment"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
