alter table "public"."professional_project" add constraint "hourly-rate-gt-zero" check (hourly_rate > 0);
