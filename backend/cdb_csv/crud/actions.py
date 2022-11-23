import logging

import dask.dataframe as dd
from pandas.core.series import Series

from cdb_csv.models.csv_row import ActionMappingCsvRow


async def map_action_mapping_row(row: Series) -> ActionMappingCsvRow:
    return ActionMappingCsvRow.parse_obj(row)


async def load_action_mapping_file(action_mapping_csv_path: str) -> dict[str, str]:
    mapping = {}

    df = dd.read_csv(  # type: ignore
        action_mapping_csv_path,
        sep=";",
        dtype=str,
        keep_default_na=False,
        na_values=["_"],
    )

    row: Series
    for _, row in df.iterrows():

        csv_row: ActionMappingCsvRow = await map_action_mapping_row(row)

        logging.debug(f"Reading {csv_row.actions} => {csv_row.focus}")

        mapping[csv_row.actions] = csv_row.focus

    return mapping
