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

CREATE TRIGGER set_notebook_modification_date
  AFTER UPDATE
  ON public.notebook
  FOR EACH ROW
  EXECUTE PROCEDURE public.notebook_modification_date();

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

CREATE TRIGGER set_notebook_focus_modification_date
  AFTER INSERT OR UPDATE
  ON public.notebook_focus
  FOR EACH ROW
  EXECUTE PROCEDURE public.notebook_focus_modification_date();


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

CREATE TRIGGER set_notebook_target_modification_date
  AFTER INSERT OR UPDATE
  ON public.notebook_target
  FOR EACH ROW
  EXECUTE PROCEDURE public.notebook_target_modification_date();


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

CREATE TRIGGER set_notebook_action_modification_date
  AFTER INSERT OR UPDATE
  ON public.notebook_action
  FOR EACH ROW
  EXECUTE PROCEDURE public.notebook_action_modification_date();

