alter table "public"."notebook" add column "geographical_area" integer null;
UPDATE notebook SET geographical_area = (
    SELECT max(mobility_radius)
    FROM professional_project
    WHERE notebook.id = professional_project.notebook_id
);
alter table "public"."professional_project" drop column "mobility_radius";
