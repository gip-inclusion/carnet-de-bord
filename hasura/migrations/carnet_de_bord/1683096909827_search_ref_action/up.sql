CREATE OR REPLACE FUNCTION public.search_ref_action(search text)
RETURNS
 SETOF ref_action
LANGUAGE sql STABLE
AS $function$
	SELECT
			*
	FROM
			ref_action
	WHERE
			 unaccent(lower(description)) LIKE
                         '%' || array_to_string(string_to_array(unaccent(lower(search)), ' '), '%') || '%'
        ORDER BY unaccent(lower(search)) <<-> unaccent(lower(description)) ASC
$function$;
