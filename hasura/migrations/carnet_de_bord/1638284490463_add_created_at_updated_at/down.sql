CREATE OR REPLACE FUNCTION public.notebook_modification_date()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
DECLARE
  session_variables json;
  professional uuid;
BEGIN
  session_variables := current_setting('hasura.user', 't');
  IF session_variables IS NOT NULL then
    professional := session_variables ->> 'x-hasura-professional-id';
    IF professional IS NOT NULL then
      UPDATE notebook_member SET notebook_modification_date=now() WHERE notebook_id=NEW.id AND professional_id = professional;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notebook_focus_modification_date()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
DECLARE
  session_variables json;
  professional uuid;
BEGIN
  session_variables := current_setting('hasura.user', 't');
  IF session_variables IS NOT NULL then
    professional := session_variables ->> 'x-hasura-professional-id';
    IF professional IS NOT NULL then
      UPDATE notebook_member SET notebook_modification_date=now() WHERE notebook_id=NEW.notebook_id AND professional_id = professional;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


CREATE OR REPLACE FUNCTION public.notebook_target_modification_date()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
DECLARE
  session_variables json;
  professional uuid;
  notebook uuid;
BEGIN
  session_variables := current_setting('hasura.user', 't');
  IF session_variables IS NOT NULL then
    professional := session_variables ->> 'x-hasura-professional-id';
    IF professional IS NOT NULL then
      SELECT focus.notebook_id into notebook FROM public.notebook_focus as focus where focus.id = NEW.focus_id;
      UPDATE notebook_member SET notebook_modification_date=now() WHERE notebook_id=notebook AND professional_id = professional;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notebook_action_modification_date()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
DECLARE
  session_variables json;
  professional uuid;
  notebook uuid;
  focus uuid;
BEGIN
  session_variables := current_setting('hasura.user', 't');
  IF session_variables IS NOT NULL then
    professional := session_variables ->> 'x-hasura-professional-id';
    IF professional IS NOT NULL then
      SELECT focus_id into focus FROM public.notebook_target where id = NEW.target_id;
      SELECT notebook_id into notebook FROM public.notebook_focus where id = focus;
      UPDATE notebook_member SET notebook_modification_date=now() WHERE notebook_id=notebook AND professional_id = professional;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;



alter table "public"."notebook_member" rename column "invitation_sent_at" to "invitation_send_date";


ALTER TABLE "public"."structure" ALTER COLUMN "created_at" drop default;

drop trigger if exists "set_public_structure_updated_at" on "public"."structure";
alter table "public"."structure"
	rename column "updated_at" to "modification_date";
ALTER TABLE "public"."structure"
ALTER COLUMN "modification_date" drop default;

alter table "public"."structure" rename column "created_at" to "creation_date";

drop trigger if exists "set_public_professional_updated_at" on "public"."professional";
alter table "public"."professional" drop column "updated_at";

alter table "public"."professional" drop column "created_at";

drop trigger if exists "set_public_notebook_target_updated_at" on "public"."notebook_target";
alter table "public"."notebook_target" drop column "updated_at";

alter table "public"."notebook_target" rename column "created_at" to "creation_date";

alter table "public"."notebook_member" rename column "last_modified_at" to "notebook_modification_date";

alter table "public"."notebook_member" rename column "last_visited_at" to "notebook_visit_date";

alter table "public"."notebook_member" rename column "created_at" to "creation_date";

DROP TRIGGER IF EXISTS "set_public_notebook_focus_updated_at" ON "public"."notebook_focus";
alter table "public"."notebook_focus" drop column "updated_at";

alter table "public"."notebook_focus" rename column "created_at" to "creation_date";

DROP TRIGGER IF EXISTS "set_public_notebook_action_updated_at" ON "public"."notebook_action";
alter table "public"."notebook_action" drop column "updated_at";

alter table "public"."notebook_action" rename column "created_at" to "creation_date";

DROP TRIGGER IF EXISTS "set_public_notebook_updated_at" ON "public"."notebook";
alter table "public"."notebook" drop column "updated_at";

alter table "public"."notebook" rename column "created_at" to "creation_date";

DROP TRIGGER IF EXISTS "set_public_beneficiary_updated_at" ON "public"."beneficiary";
alter table "public"."beneficiary" drop column "updated_at";

alter table "public"."beneficiary" drop column "created_at";

DROP TRIGGER IF EXISTS "set_public_admin_cdb_updated_at" ON "public"."admin_cdb";
alter table "public"."admin_cdb" drop column "updated_at";

alter table "public"."admin_cdb" drop column "created_at";

DROP TRIGGER IF EXISTS "set_public_account_updated_at" ON "public"."account";
alter table "public"."account" drop column "updated_at";

alter table "public"."account" drop column "created_at";
