CREATE OR REPLACE FUNCTION public.nps_rating_created_at_posix(nps_rating_row nps_rating)
  RETURNS double precision
  LANGUAGE sql
  STABLE
AS
$function$
SELECT EXTRACT (EPOCH FROM nps_rating_row.created_at) * 1000.0;
$function$;
