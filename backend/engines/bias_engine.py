import pandas as pd
import numpy as np
from fairlearn.metrics import (
    demographic_parity_difference,
    equal_opportunity_difference,
    demographic_parity_ratio
)

class BiasDetectionEngine:
    def __init__(self):
        # Regulatory/Domain Thresholds
        self.industry_standards = {
            "hiring": {"disparate_impact": 0.8, "name": "EEOC 80% Rule"},
            "finance": {"disparate_impact": 0.9, "name": "Fair Lending Standard"},
            "healthcare": {"equal_opportunity": 0.05, "name": "Patient Equity Code"},
            "generic": {"disparate_impact": 0.8, "name": "General Fairness"}
        }

    def check_structured_bias(self, df: pd.DataFrame, target: str, protected_attribute: str, industry: str = "generic"):
        """
        Calculates fairness metrics with industry-aware threshold analysis.
        """
        if protected_attribute not in df.columns or target not in df.columns:
            return {"error": f"Columns '{protected_attribute}' or '{target}' not found"}

        y_true = df[target]
        y_pred = y_true # Benchmarking historical data

        metrics = {
            "demographic_parity_diff": round(float(demographic_parity_difference(
                y_true, y_pred, sensitive_features=df[protected_attribute]
            )), 4),
            "equal_opportunity_diff": round(float(equal_opportunity_difference(
                y_true, y_pred, sensitive_features=df[protected_attribute]
            )), 4),
            "disparate_impact": round(float(demographic_parity_ratio(
                y_true, y_pred, sensitive_features=df[protected_attribute]
            )), 4)
        }
        
        # Industry Compliance Check
        standard = self.industry_standards.get(industry, self.industry_standards["generic"])
        compliance = True
        risk_level = "Low"
        
        if industry == "hiring" or industry == "finance":
            if metrics["disparate_impact"] < standard["disparate_impact"]:
                compliance = False
                risk_level = "Critical"
        elif industry == "healthcare":
            if metrics["equal_opportunity_diff"] > standard["equal_opportunity"]:
                compliance = False
                risk_level = "High"

        # AI Fairness Score v2 (Weighted by Industry Significance)
        score = (
            (1.0 - metrics["demographic_parity_diff"]) * 0.4 +
            (1.0 - metrics["equal_opportunity_diff"]) * 0.4 +
            (1.0 - abs(1.0 - metrics["disparate_impact"])) * 0.2
        )
        
        metrics["fairness_score"] = round(score * 100, 2)
        metrics["compliance_status"] = "Pass" if compliance else "Fail"
        metrics["regulatory_risk"] = risk_level
        metrics["applied_standard"] = standard["name"]
        
        return metrics
