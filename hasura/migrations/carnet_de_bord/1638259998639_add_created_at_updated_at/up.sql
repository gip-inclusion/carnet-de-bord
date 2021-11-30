
alter table "public"."account" add column "created_at" timestamptz
 not null default now();

alter table "public"."account" add column "updated_at" timestamptz
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
CREATE TRIGGER "set_public_account_updated_at"
BEFORE UPDATE ON "public"."account"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_account_updated_at" ON "public"."account" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."admin_cdb" add column "created_at" timestamptz
 not null default now();

alter table "public"."admin_cdb" add column "updated_at" timestamptz
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
CREATE TRIGGER "set_public_admin_cdb_updated_at"
BEFORE UPDATE ON "public"."admin_cdb"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_admin_cdb_updated_at" ON "public"."admin_cdb" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."beneficiary" add column "created_at" timestamptz
 not null default now();

alter table "public"."beneficiary" add column "updated_at" timestamptz
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
CREATE TRIGGER "set_public_beneficiary_updated_at"
BEFORE UPDATE ON "public"."beneficiary"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_beneficiary_updated_at" ON "public"."beneficiary" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."notebook" rename column "creation_date" to "created_at";

alter table "public"."notebook" add column "updated_at" timestamptz
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
CREATE TRIGGER "set_public_notebook_updated_at"
BEFORE UPDATE ON "public"."notebook"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notebook_updated_at" ON "public"."notebook" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."notebook_action" rename column "creation_date" to "created_at";

alter table "public"."notebook_action" add column "updated_at" timestamptz
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
CREATE TRIGGER "set_public_notebook_action_updated_at"
BEFORE UPDATE ON "public"."notebook_action"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notebook_action_updated_at" ON "public"."notebook_action" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."notebook_focus" rename column "creation_date" to "created_at";

alter table "public"."notebook_focus" add column "updated_at" timestamptz
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
CREATE TRIGGER "set_public_notebook_focus_updated_at"
BEFORE UPDATE ON "public"."notebook_focus"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notebook_focus_updated_at" ON "public"."notebook_focus" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."notebook_member" rename column "creation_date" to "created_at";

alter table "public"."notebook_member" rename column "notebook_visit_date" to "last_visited_at";

alter table "public"."notebook_member" rename column "notebook_modification_date" to "last_modified_at";

alter table "public"."notebook_target" rename column "creation_date" to "created_at";

alter table "public"."notebook_target" add column "updated_at" timestamptz
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
CREATE TRIGGER "set_public_notebook_target_updated_at"
BEFORE UPDATE ON "public"."notebook_target"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notebook_target_updated_at" ON "public"."notebook_target" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."professional" add column "created_at" timestamptz
 not null default now();

alter table "public"."professional" add column "updated_at" timestamptz
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
CREATE TRIGGER "set_public_professional_updated_at"
BEFORE UPDATE ON "public"."professional"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_professional_updated_at" ON "public"."professional" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."structure" rename column "creation_date" to "created_at";

alter table "public"."structure" alter column "modification_date" set default now();
alter table "public"."structure" rename column "modification_date" to "updated_at";

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
CREATE TRIGGER "set_public_structure_updated_at"
BEFORE UPDATE ON "public"."structure"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_structure_updated_at" ON "public"."structure" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."structure" alter column "created_at" set default now();
