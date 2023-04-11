class InsertFailError(Exception):
    """
    utility class when insert goes wrong
    """


class UpdateFailError(Exception):
    """
    utility class when update goes wrong
    """


class FindResultException(Exception):
    """
    utility class when we retrieve no result or more than one result
    """
