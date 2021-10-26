DROP TRIGGER IF EXISTS set_notebook_modification_date
  ON public.notebook;

DROP TRIGGER IF EXISTS notebook_focus_modification_date
  ON public.notebook_focus;

DROP TRIGGER IF EXISTS set_notebook_target_modification_date
  ON public.notebook_target;

DROP TRIGGER IF EXISTS set_notebook_action_modification_date
  ON public.notebook_action;
