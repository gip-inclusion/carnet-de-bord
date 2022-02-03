CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"() RETURNS TRIGGER AS $$
DECLARE _new record;
BEGIN _new := NEW;
_new."updated_at" = NOW();
RETURN _new;
END;
$$ LANGUAGE plpgsql;

--
-- Beneficiary 's strcuture many to many'
--
CREATE TABLE "public"."beneficiary_structure" (
	"id" uuid NOT NULL DEFAULT gen_random_uuid(),
	"beneficiary_id" uuid NOT NULL,
	"structure_id" uuid NOT NULL,
	"status" varchar not null default 'pending',
	"data" jsonb not null default jsonb_build_object(),
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY ("id"),
	FOREIGN KEY ("beneficiary_id") REFERENCES "public"."beneficiary"("id") ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY ("structure_id") REFERENCES "public"."structure"("id") ON UPDATE restrict ON DELETE restrict
);
COMMENT ON TABLE "public"."beneficiary_structure" IS E'associative table between beneficiary and structure (many ot many)';

CREATE TRIGGER "set_public_beneficiary_structure_updated_at" BEFORE
UPDATE ON "public"."beneficiary_structure" FOR EACH ROW EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_beneficiary_structure_updated_at" ON "public"."beneficiary_structure" IS 'trigger to set value of column "updated_at" to current timestamp on row update';

-- 
-- Admin structure
-- 
CREATE TABLE "public"."admin_structure" (
	"id" uuid NOT NULL DEFAULT gen_random_uuid(),
	"firstname" varchar,
	"lastname" varchar,
	"email" citext NOT NULL,
	"phone_numbers" varchar null,
	"position" varchar null,
	"deployment_id" uuid NOT NULL,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY ("id"),
	FOREIGN KEY ("deployment_id") REFERENCES "public"."deployment"("id") ON UPDATE restrict ON DELETE restrict,
	UNIQUE ("email")
);
COMMENT ON TABLE "public"."admin_structure" IS E'Table of structure manager, handle pro and brsa attachment';
CREATE TRIGGER "set_public_admin_structure_updated_at" BEFORE
UPDATE ON "public"."admin_structure" FOR EACH ROW EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_admin_structure_updated_at" ON "public"."admin_structure" IS 'trigger to set value of column "updated_at" to current timestamp on row update';

--
-- Account
-- Add new field for new table
--
alter table "public"."account"
add column "admin_structure_id" UUID null unique;
alter table "public"."account"
add constraint "account_admin_structure_id_fkey" foreign key ("admin_structure_id") references "public"."admin_structure" ("id") on update restrict on delete restrict;

alter table "public"."account" drop constraint "Account must be linked to a profile of the right type";
alter table "public"."account" add constraint "Account must be linked to a profile of the right type" check (type::text = 'manager'::text AND manager_id IS NOT NULL OR type::text = 'beneficiary'::text AND beneficiary_id IS NOT NULL OR type::text = 'professional'::text AND professional_id IS NOT NULL OR type::text = 'admin_cdb'::text AND admin_id IS NOT NULL OR type::text = 'admin_structure'::text AND admin_structure_id IS NOT NULL);


--
-- Admin structure many to manby relation
--
CREATE TABLE "public"."admin_structure_structure" (
	"id" uuid NOT NULL DEFAULT gen_random_uuid(),
	"admin_structure_id" uuid NOT NULL,
	"structure_id" uuid NOT NULL,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY ("id"),
	FOREIGN KEY ("admin_structure_id") REFERENCES "public"."admin_structure"("id") ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY ("structure_id") REFERENCES "public"."structure"("id") ON UPDATE restrict ON DELETE restrict
);
COMMENT ON TABLE "public"."admin_structure_structure" IS E'associative table between admin_structure and structure (many ot many)';



