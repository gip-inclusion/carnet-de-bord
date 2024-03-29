CREATE OR REPLACE FUNCTION public.search_public_notebooks(search text)
RETURNS SETOF notebook_public_view
LANGUAGE sql
STABLE
AS $function$
  SELECT
    notebook_public_view.*
  FROM
    notebook_public_view
    JOIN beneficiary ON beneficiary.id = notebook_public_view.beneficiary_id
  WHERE
    unaccent(search) <% unaccent(CONCAT(beneficiary.firstname, ' ', beneficiary.lastname))
    OR search <% beneficiary.pe_number
    OR search <% beneficiary.caf_number
    OR search <% beneficiary.mobile_number
$function$;
