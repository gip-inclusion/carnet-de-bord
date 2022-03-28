CREATE OR REPLACE FUNCTION public.record_notebook_target_event() RETURNS trigger AS
$$
DECLARE
  new_notebook_id uuid;
BEGIN

  SELECT notebook_focus.notebook_id
  INTO new_notebook_id
  FROM notebook_focus
  WHERE notebook_focus.id = NEW.focus_id;

  INSERT INTO notebook_event
  (notebook_id, event_date, professional_id, event, event_type)
  VALUES
  (new_notebook_id, now(), NEW.creator_id, ('{ "type": "status_changed", "old": "' || OLD.status || '", "new": "' || NEW.status || '"}')::jsonb, 'target');
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER record_notebook_target_event_update_trigger
AFTER UPDATE ON public.notebook_target
    FOR EACH ROW
    WHEN ((OLD.status)
       IS DISTINCT FROM
      (NEW.status))
    EXECUTE PROCEDURE public.record_notebook_target_event()
;
