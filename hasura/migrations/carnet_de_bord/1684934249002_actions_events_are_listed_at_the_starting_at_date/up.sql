CREATE OR REPLACE FUNCTION public.record_notebook_action_event()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
  (notebook_id, event_date, creator_id, event, event_type)
  VALUES
  (new_notebook_id, NEW.starting_at, NEW.creator_id, ('{ "category": "' || focus_theme || '", "status": "' || NEW.status || '", "event_label": "' || NEW.action || '"}')::jsonb, 'action');
  RETURN NEW;
END;
$function$;
