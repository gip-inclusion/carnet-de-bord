alter table "public"."professional_project" add column "mobility_radius" integer null;
UPDATE professional_project SET mobility_radius = (
    SELECT geographical_area
    FROM notebook
    WHERE notebook.id = professional_project.notebook_id
);
alter table "public"."notebook" drop column "geographical_area";
