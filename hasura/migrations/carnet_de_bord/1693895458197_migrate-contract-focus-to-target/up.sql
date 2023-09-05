alter table "public"."notebook_target" add column "linked_to" varchar null;

update notebook_target set linked_to = notebook_focus.linked_to from notebook_focus where notebook_focus.id = focus_id;

alter table "public"."notebook_focus" drop column "linked_to";
