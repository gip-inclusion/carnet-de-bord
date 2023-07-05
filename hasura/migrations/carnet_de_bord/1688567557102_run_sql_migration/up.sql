CREATE OR REPLACE FUNCTION public.notebook_record_visit()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
  INSERT INTO public.notebook_visit(notebook_id, account_id, visited_at)
    VALUES(NEW.notebook_id, NEW.account_id, NEW.last_visited_at);
  RETURN NEW;
END;
$$;

CREATE TRIGGER notebook_record_visit
  AFTER UPDATE OF last_visited_at
  ON public.notebook_member
  FOR EACH ROW
  EXECUTE PROCEDURE public.notebook_record_visit();
