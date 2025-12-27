
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import IsolationForest, RandomForestRegressor
import joblib
import json
import os

# Configuration
DATA_PATH = r"c:\Coding\Github\RailX-AI_Based_Intelligent_Metro_Health_Monitoring_and_Optimized_Scheduling_System\Dataset\MetroPT3(AirCompressor).csv"
MODEL_DIR = r"c:\Coding\Github\RailX-AI_Based_Intelligent_Metro_Health_Monitoring_and_Optimized_Scheduling_System\ml_pipeline"
MODEL_PATH = os.path.join(MODEL_DIR, "health_model.pkl")
METRICS_PATH = os.path.join(MODEL_DIR, "metrics.json")

def load_data():
    print("Loading dataset...")
    # Reading a sample first to check columns, but ideally we read needed columns
    # Given the file size (~200MB), we can read the whole thing
    df = pd.read_csv(DATA_PATH)
    return df

def analyze_and_train():
    df = load_data()
    print(f"Data Loaded: {df.shape}")
    print(df.head())
    
    # Preprocessing
    # Drop timestamp for training
    feature_cols = [c for c in df.columns if c not in ['timestamp', 'Unnamed: 0']]
    
    # Check for missing values
    df = df.dropna()
    
    X = df[feature_cols]
    
    # Logic for Target:
    # Since there is no explicit 'health' label, and the user wants to identify if metro "needs repair",
    # we can use Isolation Forest for Anomaly Detection. 
    # Anomaly Score can be mapped to Health Score.
    # Normal points -> High Health Score
    # Anomalies -> Low Health Score
    
    print("Splitting data 70/30...")
    X_train, X_test = train_test_split(X, test_size=0.3, random_state=42)
    
    print("Training Isolation Forest (Tree-based Anomaly Detection)...")
    # contamination='auto' or small value assumes most trains are healthy
    clf = IsolationForest(random_state=42, n_jobs=-1, contamination=0.01) 
    clf.fit(X_train)
    
    print("Evaluating on Test set...")
    y_pred_test = clf.predict(X_test)
    # predict returns 1 for inlier, -1 for outlier
    
    n_outliers = np.sum(y_pred_test == -1)
    n_inliers = np.sum(y_pred_test == 1)
    
    print(f"Test Set Results: Inliers={n_inliers}, Outliers={n_outliers}")
    
    # Verify scoring logic
    # decision_function returns anomaly score. Lower = more abnormal.
    scores = clf.decision_function(X_test)
    print(f"Score stats: Min={scores.min()}, Max={scores.max()}, Mean={scores.mean()}")
    
    # Save Model
    print(f"Saving model to {MODEL_PATH}")
    joblib.dump(clf, MODEL_PATH)
    
    # Save Metrics
    metrics = {
        "n_train": len(X_train),
        "n_test": len(X_test),
        "test_outliers": int(n_outliers),
        "test_inliers": int(n_inliers),
        "score_min": float(scores.min()),
        "score_max": float(scores.max())
    }
    with open(METRICS_PATH, 'w') as f:
        json.dump(metrics, f, indent=4)
        
    print("Training Complete.")

if __name__ == "__main__":
    analyze_and_train()
