CREATE TABLE "public"."orientation_manager" (
	"id" uuid NOT NULL DEFAULT gen_random_uuid(),
	"firstname" varchar,
	"lastname" varchar,
	"email" citext NOT NULL,
	"phone_numbers" varchar,
	"deployment_id" uuid NOT NULL,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY ("id") ,
	FOREIGN KEY ("deployment_id") REFERENCES "public"."deployment"("id") ON UPDATE restrict ON DELETE restrict,
	UNIQUE ("email")
);

comment on column "public"."orientation_manager"."phone_numbers" is E'liste des numéros de téléphones séparés par des virgules';

COMMENT ON TABLE "public"."orientation_manager" IS E'Table des chargés d’orientation';

alter table "public"."account" add column "orientation_manager_id" uuid null;

alter table "public"."account"
  add constraint "account_orientation_manager_id_fkey"
  foreign key ("orientation_manager_id")
  references "public"."orientation_manager"
  ("id") on update restrict on delete restrict;

alter table "public"."account" drop constraint "Account must be linked to a profile of the right type";

alter table "public"."account" add constraint "Account must be linked to a profile of the right type" check (
		type::text = 'manager'::text
		AND manager_id IS NOT NULL
		OR type::text = 'beneficiary'::text
		AND beneficiary_id IS NOT NULL
		OR type::text = 'professional'::text
		AND professional_id IS NOT NULL
		OR type::text = 'admin_cdb'::text
		AND admin_id IS NOT NULL
		OR type::text = 'admin_structure'::text
		AND admin_structure_id IS NOT NULL
		OR type::text = 'orientation_manager'::text
		AND orientation_manager_id IS NOT NULL
	);


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
CREATE TRIGGER "set_public_orientation_manager_updated_at"
BEFORE UPDATE ON "public"."orientation_manager"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_orientation_manager_updated_at" ON "public"."orientation_manager"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
