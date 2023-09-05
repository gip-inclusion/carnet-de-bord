alter table "public"."notebook_focus" add column "linked_to" varchar null;

update notebook_focus set linked_to = notebook_target.linked_to from notebook_target where notebook_focus.id = focus_id;

alter table "public"."notebook_target" drop column "linked_to";
