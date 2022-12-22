ALTER TABLE "public"."notebook_member"
  DROP COLUMN membership_ended_at;

DROP INDEX "notebook_member_notebook_id_account_id_if_active";

ALTER TABLE ONLY public.notebook_member
    ADD CONSTRAINT "notebook_member_notebook_id_account_id_key" UNIQUE (notebook_id, account_id);
