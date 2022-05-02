-- REMOVE CONSTRAINTS

ALTER TABLE ONLY public.notebook_member DROP CONSTRAINT notebook_member_professional_id_fkey;
ALTER TABLE ONLY public.notebook_member DROP CONSTRAINT notebook_member_creator_id_fkey;
ALTER TABLE ONLY public.notebook_focus DROP CONSTRAINT notebook_focus_creator_id_fkey;
ALTER TABLE ONLY public.notebook_target DROP CONSTRAINT notebook_target_creator_id_fkey;
ALTER TABLE ONLY public.notebook_action DROP CONSTRAINT notebook_action_creator_id_fkey;
ALTER TABLE ONLY public.notebook_event DROP CONSTRAINT notebook_event_professional_id_fkey;

-- UPDATE DATA

UPDATE public.notebook_member SET professional_id = public.account.id
FROM  public.account
WHERE  public.notebook_member.professional_id = public.account.professional_id;

UPDATE public.notebook_member SET creator_id = public.account.id
FROM  public.account
WHERE  public.notebook_member.creator_id = public.account.professional_id;

UPDATE public.notebook_focus SET creator_id = public.account.id
FROM  public.account
WHERE  public.notebook_focus.creator_id = public.account.professional_id;

UPDATE public.notebook_target SET creator_id = public.account.id
FROM  public.account
WHERE  public.notebook_target.creator_id = public.account.professional_id;

UPDATE public.notebook_action SET creator_id = public.account.id
FROM  public.account
WHERE  public.notebook_action.creator_id = public.account.professional_id;

UPDATE public.notebook_event SET professional_id = public.account.id
FROM  public.account
WHERE  public.notebook_event.professional_id = public.account.professional_id;

-- RENAME COLUMNS

ALTER TABLE ONLY public.notebook_member RENAME COLUMN professional_id TO account_id;
ALTER TABLE ONLY public.notebook_event RENAME COLUMN professional_id TO creator_id;

-- RE-APPLY CONSTRAINTS

ALTER TABLE ONLY public.notebook_member
    ADD CONSTRAINT notebook_member_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id) ON UPDATE RESTRICT ON DELETE CASCADE;
-- TODO update mutation

ALTER TABLE ONLY public.notebook_member
    ADD CONSTRAINT notebook_member_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.account(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
-- todo Update mutation when a person is invited in notebook_member

ALTER TABLE ONLY public.notebook_focus
    ADD CONSTRAINT notebook_focus_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.account(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


ALTER TABLE ONLY public.notebook_target
    ADD CONSTRAINT notebook_target_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.account(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


ALTER TABLE ONLY public.notebook_action
    ADD CONSTRAINT notebook_action_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.account(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


ALTER TABLE ONLY public.notebook_event
    ADD CONSTRAINT notebook_event_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.account(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
