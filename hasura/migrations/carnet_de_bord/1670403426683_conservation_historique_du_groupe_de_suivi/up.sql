ALTER TABLE "public"."notebook_member"
  ADD membership_ended_at date;

ALTER TABLE ONLY "public"."notebook_member"
  DROP CONSTRAINT "notebook_member_notebook_id_account_id_key";

CREATE UNIQUE INDEX "notebook_member_notebook_id_account_id_if_active"
  ON "public"."notebook_member" (notebook_id, account_id)
  WHERE (active);
