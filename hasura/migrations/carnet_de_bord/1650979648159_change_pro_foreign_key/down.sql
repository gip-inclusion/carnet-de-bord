-- REMOVE CONSTRAINTS

ALTER TABLE ONLY public.notebook_member DROP CONSTRAINT notebook_member_notebook_id_account_id_key;
ALTER TABLE ONLY public.notebook_member DROP CONSTRAINT notebook_member_account_id_fkey;
ALTER TABLE ONLY public.notebook_member DROP CONSTRAINT notebook_member_creator_id_fkey;
ALTER TABLE ONLY public.notebook_focus DROP CONSTRAINT notebook_focus_creator_id_fkey;
ALTER TABLE ONLY public.notebook_target DROP CONSTRAINT notebook_target_creator_id_fkey;
ALTER TABLE ONLY public.notebook_action DROP CONSTRAINT notebook_action_creator_id_fkey;
ALTER TABLE ONLY public.notebook_event DROP CONSTRAINT notebook_event_creator_id_fkey;


-- UPDATE DATA

UPDATE public.notebook_member SET account_id = public.account.professional_id
FROM  public.account
WHERE  public.notebook_member.account_id = public.account.id;

UPDATE public.notebook_member SET creator_id = public.account.professional_id
FROM  public.account
WHERE  public.notebook_member.creator_id = public.account.id;

UPDATE public.notebook_focus SET creator_id = public.account.professional_id
FROM  public.account
WHERE  public.notebook_focus.creator_id = public.account.id;

UPDATE public.notebook_target SET creator_id = public.account.professional_id
FROM  public.account
WHERE  public.notebook_target.creator_id = public.account.id;

UPDATE public.notebook_action SET creator_id = public.account.professional_id
FROM  public.account
WHERE  public.notebook_action.creator_id = public.account.id;

UPDATE public.notebook_event SET creator_id = public.account.professional_id
FROM  public.account
WHERE  public.notebook_event.creator_id = public.account.id;


-- RENAME COLUMNS

ALTER TABLE ONLY public.notebook_member RENAME COLUMN account_id TO professional_id;
ALTER TABLE ONLY public.notebook_event RENAME COLUMN creator_id TO professional_id;


-- RE-APPLY CONSTRAINTS
ALTER TABLE ONLY public.notebook_member
    ADD CONSTRAINT notebook_member_notebook_id_professional_id_key unique ("notebook_id", "professional_id");

ALTER TABLE ONLY public.notebook_member
    ADD CONSTRAINT notebook_member_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES public.professional(id) ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY public.notebook_member
    ADD CONSTRAINT notebook_member_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.professional(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE ONLY public.notebook_focus
    ADD CONSTRAINT notebook_focus_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.professional(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE ONLY public.notebook_target
    ADD CONSTRAINT notebook_target_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.professional(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE ONLY public.notebook_action
    ADD CONSTRAINT notebook_action_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.professional(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE ONLY public.notebook_event
    ADD CONSTRAINT notebook_event_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES public.professional(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


-- TRIGGERS

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
      UPDATE notebook_member SET last_modified_at=now() WHERE notebook_id=NEW.id AND professional_id = professional;
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
      UPDATE notebook_member SET last_modified_at=now() WHERE notebook_id=NEW.notebook_id AND professional_id = professional;
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
      UPDATE notebook_member SET last_modified_at=now() WHERE notebook_id=notebook AND professional_id = professional;
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
      UPDATE notebook_member SET last_modified_at=now() WHERE notebook_id=notebook AND professional_id = professional;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


CREATE OR REPLACE FUNCTION public.record_notebook_target_event() RETURNS trigger AS
$$
DECLARE
  new_notebook_id uuid;
  focus_theme text;
BEGIN

  SELECT notebook_focus.notebook_id, notebook_focus.theme
  INTO new_notebook_id, focus_theme
  FROM notebook_focus
  WHERE notebook_focus.id = NEW.focus_id;

  INSERT INTO notebook_event
  (notebook_id, event_date, professional_id, event, event_type)
  VALUES
  (new_notebook_id, now(), NEW.creator_id, ('{ "category": "' || focus_theme || '", "status": "' || NEW.status || '", "event_label": "' || NEW.target || '"}')::jsonb, 'target');
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.record_notebook_action_event() RETURNS trigger AS
$$
DECLARE
  new_notebook_id uuid;
  focus_theme text;
BEGIN

  SELECT notebook_focus.notebook_id, notebook_focus.theme
  INTO new_notebook_id, focus_theme
  FROM notebook_focus, notebook_target
  WHERE notebook_focus.id = notebook_target.focus_id
  AND notebook_target.id = NEW.target_id;

  INSERT INTO notebook_event
  (notebook_id, event_date, professional_id, event, event_type)
  VALUES
  (new_notebook_id, now(), NEW.creator_id, ('{ "category": "' || focus_theme || '", "status": "' || NEW.status || '", "event_label": "' || NEW.action || '"}')::jsonb, 'action');
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;