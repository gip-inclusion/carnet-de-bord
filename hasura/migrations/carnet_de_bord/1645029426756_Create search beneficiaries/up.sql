CREATE FUNCTION search_beneficiaries(search text)
RETURNS SETOF beneficiary AS $$
    SELECT *
    FROM beneficiary
    WHERE
    unaccent(search) <% lastname
    OR search <% pe_number
    OR search <% caf_number
    OR search <% mobile_number
$$ LANGUAGE sql STABLE;
