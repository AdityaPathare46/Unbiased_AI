import pandas as pd
import re

class PrivacyService:
    def __init__(self):
        # Common PII Patterns
        self.patterns = {
            "email": r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
            "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
            "phone": r'\b(?:\+?1[-. ]?)?\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})\b',
            "credit_card": r'\b(?:\d[ -]*?){13,16}\b'
        }

    def detect_pii(self, df: pd.DataFrame):
        """
        Scans all columns for potential PII patterns.
        Returns a list of columns flagged as sensitive.
        """
        flagged_columns = []
        
        # We only scan object/string columns
        for col in df.select_dtypes(include=['object']):
            # Sample first 100 rows for speed
            sample = df[col].dropna().head(100).astype(str)
            for label, pattern in self.patterns.items():
                if sample.str.contains(pattern, regex=True).any():
                    flagged_columns.append({"column": col, "type": label})
                    break
        
        return flagged_columns

    def mask_pii(self, df: pd.DataFrame, columns_to_mask: list):
        """
        Replaces sensitive data with [MASKED].
        """
        df_masked = df.copy()
        for col_info in columns_to_mask:
            col = col_info["column"]
            df_masked[col] = "[MASKED_" + col_info["type"].upper() + "]"
        
        return df_masked

    def anonymize_dataset(self, df: pd.DataFrame):
        """
        Convenience method to scan and mask automatically.
        """
        flagged = self.detect_pii(df)
        if flagged:
            df = self.mask_pii(df, flagged)
        return df, flagged
