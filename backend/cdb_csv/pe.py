import dask.dataframe as dd


def parse_principal_csv(principal_csv: str):
    df = dd.read_csv(principal_csv)
    print(df)
