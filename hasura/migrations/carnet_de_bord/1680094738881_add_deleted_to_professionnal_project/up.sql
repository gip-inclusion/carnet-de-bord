
alter table "public"."professional_project" add column "created_by" uuid
 null;

alter table "public"."professional_project"
  add constraint "professional_project_updated_by_fkey"
  foreign key ("updated_by")
  references "public"."account"
  ("id") on update set null on delete set null;

alter table "public"."professional_project"
  add constraint "professional_project_created_by_fkey"
  foreign key ("created_by")
  references "public"."account"
  ("id") on update set null on delete set null;

CREATE TABLE history (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "schema_name" text NOT NULL,
  "table_name" text NOT NULL,
  "operation" text NOT NULL,
  "created_by" uuid,
  "new_val" jsonb,
  "old_val" jsonb,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("created_by") REFERENCES "public"."account"("id") ON UPDATE restrict ON DELETE restrict
);

CREATE FUNCTION change_trigger() RETURNS trigger AS $$
DECLARE
  session_variables json;
  creator_id uuid;
BEGIN
  session_variables := current_setting('hasura.user', 't');
  IF session_variables IS NOT NULL then
    creator_id := session_variables ->> 'x-hasura-user-id';
  END IF;
  IF      TG_OP = 'INSERT'
  THEN
    INSERT INTO history (table_name, schema_name, operation, new_val, created_by)
      VALUES (TG_RELNAME, TG_TABLE_SCHEMA, TG_OP, row_to_json(NEW), creator_id);
    RETURN NEW;
  ELSIF   TG_OP = 'UPDATE'
  THEN
    INSERT INTO history (table_name, schema_name, operation, new_val, old_val, created_by)
      VALUES (TG_RELNAME, TG_TABLE_SCHEMA, TG_OP, row_to_json(NEW), row_to_json(OLD), creator_id);
    RETURN NEW;
  ELSIF   TG_OP = 'DELETE'
  THEN
    INSERT INTO history (table_name, schema_name, operation, old_val, created_by)
      VALUES (TG_RELNAME, TG_TABLE_SCHEMA, TG_OP, row_to_json(OLD), creator_id);
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER t
AFTER INSERT OR UPDATE OR DELETE ON professional_project
  FOR EACH ROW EXECUTE PROCEDURE change_trigger();
