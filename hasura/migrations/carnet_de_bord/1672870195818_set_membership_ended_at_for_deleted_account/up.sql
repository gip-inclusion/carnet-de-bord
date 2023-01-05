UPDATE notebook_member
SET    membership_ended_at = (SELECT deleted_at
                              FROM   account
                              WHERE  notebook_member.account_id = account.id)
WHERE  membership_ended_at IS NULL
       AND (SELECT deleted_at
            FROM   account
            WHERE  notebook_member.account_id = account.id) IS NOT NULL;
