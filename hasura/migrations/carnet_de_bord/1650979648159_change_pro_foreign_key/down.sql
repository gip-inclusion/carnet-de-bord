-- REMOVE CONSTRAINTS

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
