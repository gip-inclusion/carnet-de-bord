# ruff: noqa: E501

"""
Result for a call to:
TODO: change this when test data are available
"""
PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK = {
    "codeRetour": "S001",
    # "identifiant": "e1881749-1334-47b9-8a34-74922528d4ea#LQdESFx4KSZklOXWJGJ9yxWLdwqbKWx6dh-9FNc11S0Q4YjU6YhojWUqxyVTWvuk",
    "identifiant": "usager_identifiant",
    "message": "Approchant trouvé",
    "topIdentiteCertifiee": "O",
}


PE_API_RECHERCHE_USAGERS_RESULT_KO_MOCK = {
    "codeRetour": "S002",
    "identifiant": None,
    "message": "Aucun approchant trouvé",
    "topIdentiteCertifiee": None,
}
