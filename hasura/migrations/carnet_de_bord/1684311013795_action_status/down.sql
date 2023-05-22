UPDATE notebook_action SET status='abandoned' WHERE status='abandonned';
UPDATE notebook_target SET status='abandoned' WHERE status='abandonned';

UPDATE notebook_event SET event = event::jsonb || '{"status":"abandoned"}' WHERE event->>'status' = 'abandonned';

alter table public.notebook_action drop constraint "notebook_action_status_fkey";

DROP TABLE public.action_status;

DROP TRIGGER IF EXISTS record_notebook_action_event_update_trigger on public.notebook_action;

ALTER TABLE notebook_action ALTER COLUMN status TYPE varchar;

CREATE TRIGGER record_notebook_action_event_update_trigger
AFTER UPDATE ON public.notebook_action
    FOR EACH ROW
    WHEN ((OLD.status)
       IS DISTINCT FROM
      (NEW.status))
    EXECUTE PROCEDURE public.record_notebook_action_event()
;
