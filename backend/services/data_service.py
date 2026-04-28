import pandas as pd
import io
from sqlalchemy import create_engine
import os

class DataService:
    @staticmethod
    def load_from_file(contents: bytes, filename: str) -> pd.DataFrame:
        """
        Loads data from various file formats into a Pandas DataFrame.
        """
        extension = os.path.splitext(filename)[1].lower()
        file_io = io.BytesIO(contents)
        
        if extension == '.csv':
            return pd.read_csv(file_io)
        elif extension in ['.xlsx', '.xls']:
            return pd.read_excel(file_io)
        elif extension == '.json':
            return pd.read_json(file_io)
        elif extension == '.parquet':
            return pd.read_parquet(file_io)
        else:
            raise ValueError(f"Unsupported file format: {extension}")

    @staticmethod
    def load_from_sql(connection_url: str, query: str) -> pd.DataFrame:
        """
        Loads data from an SQL database into a Pandas DataFrame.
        """
        try:
            engine = create_engine(connection_url)
            df = pd.read_sql(query, engine)
            return df
        except Exception as e:
            raise ConnectionError(f"Failed to connect to database or execute query: {str(e)}")
