import pandas as pd
import numpy as np
from fairlearn.preprocessing import CorrelationRemover

class MitigationEngine:
    def __init__(self):
        pass

    def suggest_strategies(self, metrics: dict):
        """
        Provides automated suggestions based on bias metrics.
        """
        suggestions = []
        
        if metrics.get('disparate_impact', 1.0) < 0.8:
            suggestions.append({
                "type": "Pre-processing",
                "method": "Re-weighting",
                "impact": "High",
                "description": "Adjust the weights of samples in the training set to ensure the model doesn't over-rely on historical bias associated with protected attributes."
            })
            
        if metrics.get('demographic_parity_diff', 0.0) > 0.1:
            suggestions.append({
                "type": "In-processing",
                "method": "Fairness-Aware Training",
                "impact": "Critical",
                "description": "Integrate fairness constraints directly into the loss function during model training."
            })
            
        if metrics.get('equal_opportunity_diff', 0.0) > 0.1:
            suggestions.append({
                "type": "Post-processing",
                "method": "Equalized Odds Thresholding",
                "impact": "Medium",
                "description": "Adjust the decision thresholds for different groups to ensure a similar true positive rate across all demographics."
            })
            
        return suggestions

    def apply_correlation_remover(self, df: pd.DataFrame, sensitive_feature: str, alpha: float = 1.0):
        """
        Applies Fairlearn correlation remover to reduce bias.
        """
        # This is part of the "What-If" simulator (Innovation Layer)
        X = df.drop(columns=[sensitive_feature])
        cr = CorrelationRemover(sensitive_feature_ids=[sensitive_feature], alpha=alpha)
        X_transformed = cr.fit_transform(X)
        
        return pd.DataFrame(X_transformed, columns=X.columns)
