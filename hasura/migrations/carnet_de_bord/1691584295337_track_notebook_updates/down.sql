DROP TABLE "public"."notebook_update";

-- Delete new triggers

DROP TRIGGER track_notebook_beneficiary_updates ON public.beneficiary;
DROP TRIGGER track_notebook_appointment_updates ON public.notebook_appointment;
DROP TRIGGER track_notebook_situation_updates ON public.notebook_situation;
DROP TRIGGER track_professional_project_updates ON public.professional_project;

DROP FUNCTION public.notebook_beneficiary_modification_date();
DROP FUNCTION public.notebook_appointment_modification_date();
DROP FUNCTION public.notebook_situation_modification_date();
DROP FUNCTION public.professional_project_modification_date();

-- Restore old triggers

CREATE OR REPLACE FUNCTION public.notebook_modification_date()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
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

CREATE OR REPLACE FUNCTION public.notebook_focus_modification_date()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
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

CREATE OR REPLACE FUNCTION public.notebook_target_modification_date()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
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


CREATE OR REPLACE FUNCTION public.notebook_action_modification_date()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
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
