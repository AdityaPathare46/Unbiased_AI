import shap
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io
import base64

class XAIEngine:
    def __init__(self):
        pass

    def explain_model(self, model, X_train: pd.DataFrame):
        """
        Generates SHAP explanations for a trained model.
        Returns feature importance data and a base64 encoded plot.
        """
        # SHAP calculation
        explainer = shap.Explainer(model, X_train)
        shap_values = explainer(X_train)

        # 1. Get feature importance (mean absolute SHAP values)
        importance = np.abs(shap_values.values).mean(0)
        feature_names = X_train.columns
        feature_importance = dict(zip(feature_names, importance))
        
        # Sort importance
        feature_importance = dict(sorted(feature_importance.items(), key=lambda item: item[1], reverse=True))

        # 2. Generate summary plot as image
        plt.figure(figsize=(10, 6))
        shap.summary_plot(shap_values, X_train, show=False)
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight')
        plt.close()
        buf.seek(0)
        plot_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')

        return {
            "feature_importance": feature_importance,
            "plot": plot_base64
        }

    def explain_instance(self, model, instance: pd.Series, X_train: pd.DataFrame):
        """
        Provides local explanation for a single prediction.
        """
        explainer = shap.Explainer(model, X_train)
        shap_values = explainer(instance.to_frame().T)
        
        return shap_values.values.tolist()
