import dask.dataframe as dd
from api.db.beneficiary import get_beneficiary_from_csv


async def parse_principal_csv(principal_csv: str):
    df = dd.read_csv(principal_csv, sep=";")

    for _, row in df.iterrows():
        await get_beneficiary_from_csv(
            row["civilite"], row["nom"], row["prenom"], row["lieu_naissance"]
        )
