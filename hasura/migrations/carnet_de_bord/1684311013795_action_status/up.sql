UPDATE notebook_action SET status='abandonned' WHERE status='abandoned';
UPDATE notebook_target SET status='abandonned' WHERE status='abandoned';

UPDATE notebook_event SET event = event::jsonb || '{"status":"abandonned"}' WHERE event->>'status' = 'abandoned';

CREATE TABLE "public"."action_status" (
  "status" text NOT NULL, PRIMARY KEY ("status")
);
COMMENT ON TABLE "public"."action_status" IS E'available actions status';

INSERT INTO action_status(status) VALUES('in_progress');
INSERT INTO action_status(status) VALUES('done');
INSERT INTO action_status(status) VALUES('abandonned');
INSERT INTO action_status(status) VALUES('canceled');
INSERT INTO action_status(status) VALUES('planned');
INSERT INTO action_status(status) VALUES('standby');

-- enum table must use type TEXT so we need to update
-- notebook_action.status type too
-- to do that, we need to remove trigger before update status type

DROP TRIGGER IF EXISTS record_notebook_action_event_update_trigger on public.notebook_action;

ALTER TABLE public.notebook_action
  add constraint "notebook_action_status_fkey"
  foreign key ("status")
  references public.action_status
  (status) on update restrict on delete restrict;

CREATE TRIGGER record_notebook_action_event_update_trigger
AFTER UPDATE ON public.notebook_action
    FOR EACH ROW
    WHEN ((OLD.status)
       IS DISTINCT FROM
      (NEW.status))
    EXECUTE PROCEDURE public.record_notebook_action_event()
;
