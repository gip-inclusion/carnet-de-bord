CREATE OR REPLACE FUNCTION
	public.nps_rating_dismissal_dismissed_at_posix(
		nps_rating_dismissal_row nps_rating_dismissal
	)
  RETURNS double precision
  LANGUAGE sql
  STABLE
AS
$function$
SELECT EXTRACT (EPOCH FROM nps_rating_dismissal_row.dismissed_at) * 1000.0;
$function$;
