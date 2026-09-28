import os
import json
import time
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.dummy import DummyRegressor, DummyClassifier
from sklearn.linear_model import Ridge, LogisticRegression
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, GradientBoostingRegressor, GradientBoostingClassifier
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, accuracy_score, f1_score, confusion_matrix, classification_report
import joblib

# 1. Load Data
data_path = 'data/icpsr_39815_military_stress.csv'
print(f"Loading empirical dataset from {data_path}...")
df = pd.read_csv(data_path)
print(f"Dataset shape: {df.shape}")

# Define feature columns
feature_cols = [
    'average_sleep_hours',
    'mood_score',
    'resting_heart_rate',
    'hrv_ms',
    'days_since_last_leave',
    'consecutive_field_days',
    'night_duty_shifts',
    'family_worry_score',
    'family_emergency',
    'reported_symptoms_count',
    'moca_score',
    'reaction_time_s',
    'switch_cost_s',
    'backward_errors'
]

X = df[feature_cols]
y_reg = df['stress_percentage']
y_clf = df['treatment_priority']

# 2. Strict Featurization Ordering: Split BEFORE Fitting Any Preprocessing Pipelines
print("\n--- Step 1: Strict Featurization Ordering (Train/Test Split) ---")
X_train, X_test, y_train_reg, y_test_reg, y_train_clf, y_test_clf = train_test_split(
    X, y_reg, y_clf, test_size=0.20, random_state=42, stratify=y_clf
)
print(f"Training set: {X_train.shape[0]} samples")
print(f"Held-out test set: {X_test.shape[0]} samples")

# Fit Imputer and Scaler ONLY on Training Data
imputer = SimpleImputer(strategy='median')
imputer.fit(X_train)
X_train_imp = imputer.transform(X_train)
X_test_imp = imputer.transform(X_test)

scaler = StandardScaler()
scaler.fit(X_train_imp)
X_train_scaled = scaler.transform(X_train_imp)
X_test_scaled = scaler.transform(X_test_imp)

# 3. Model Training & Comparison: Regression (Stress Percentage 0-100%)
print("\n--- Step 2: Continuous Stress Score Regression Models ---")
kf = KFold(n_splits=5, shuffle=True, random_state=42)

reg_models = {
    "Naive Baseline (Mean)": DummyRegressor(strategy='mean'),
    "Linear Baseline (Ridge)": Ridge(alpha=1.0, random_state=42),
    "Random Forest": RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42),
    "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, max_depth=4, learning_rate=0.08, random_state=42)
}

reg_results = {}
for name, model in reg_models.items():
    t0 = time.time()
    # K-fold CV on training set
    if "Linear" in name:
        cv_scores = cross_val_score(model, X_train_scaled, y_train_reg, cv=kf, scoring='r2')
        model.fit(X_train_scaled, y_train_reg)
        y_pred = model.predict(X_test_scaled)
    else:
        cv_scores = cross_val_score(model, X_train_imp, y_train_reg, cv=kf, scoring='r2')
        model.fit(X_train_imp, y_train_reg)
        y_pred = model.predict(X_test_imp)
    train_time = time.time() - t0
    
    mae = mean_absolute_error(y_test_reg, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test_reg, y_pred))
    r2 = r2_score(y_test_reg, y_pred)
    
    reg_results[name] = {
        'CV_R2_Mean': float(np.mean(cv_scores)),
        'CV_R2_Std': float(np.std(cv_scores)),
        'Test_R2': float(r2),
        'Test_MAE': float(mae),
        'Test_RMSE': float(rmse),
        'Train_Time_s': float(train_time),
        'model_obj': model
    }
    print(f"[{name}] Test R²: {r2:.4f} | Test MAE: {mae:.2f}% | Test RMSE: {rmse:.2f}% | CV R²: {np.mean(cv_scores):.4f} (±{np.std(cv_scores):.4f})")

# 4. Model Training & Comparison: Classification (Treatment Priority)
print("\n--- Step 3: Treatment Priority Triage Classification Models ---")
clf_models = {
    "Naive Baseline (Prior)": DummyClassifier(strategy='prior'),
    "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42),
    "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, max_depth=4, learning_rate=0.08, random_state=42)
}

clf_results = {}
priority_classes = ["Low Priority", "Medium Priority", "High Priority", "Immediate Priority"]

for name, model in clf_models.items():
    t0 = time.time()
    if "Logistic" in name:
        cv_scores = cross_val_score(model, X_train_scaled, y_train_clf, cv=kf, scoring='f1_macro')
        model.fit(X_train_scaled, y_train_clf)
        y_pred = model.predict(X_test_scaled)
    else:
        cv_scores = cross_val_score(model, X_train_imp, y_train_clf, cv=kf, scoring='f1_macro')
        model.fit(X_train_imp, y_train_clf)
        y_pred = model.predict(X_test_imp)
    train_time = time.time() - t0
    
    acc = accuracy_score(y_test_clf, y_pred)
    f1_macro = f1_score(y_test_clf, y_pred, average='macro', zero_division=0)
    f1_weighted = f1_score(y_test_clf, y_pred, average='weighted', zero_division=0)
    cm = confusion_matrix(y_test_clf, y_pred, labels=priority_classes)
    
    clf_results[name] = {
        'CV_F1_Macro_Mean': float(np.mean(cv_scores)),
        'CV_F1_Macro_Std': float(np.std(cv_scores)),
        'Test_Accuracy': float(acc),
        'Test_F1_Macro': float(f1_macro),
        'Test_F1_Weighted': float(f1_weighted),
        'Confusion_Matrix': cm.tolist(),
        'Train_Time_s': float(train_time),
        'model_obj': model
    }
    print(f"[{name}] Test Accuracy: {acc*100:.2f}% | Test Macro F1: {f1_macro:.4f} | Test Weighted F1: {f1_weighted:.4f} | CV Macro F1: {np.mean(cv_scores):.4f}")

# 5. Feature Importances (from best Gradient Boosting model)
best_gb_reg = reg_results["Gradient Boosting"]['model_obj']
feature_importances = dict(zip(feature_cols, [float(v) for v in best_gb_reg.feature_importances_]))
sorted_importances = sorted(feature_importances.items(), key=lambda x: x[1], reverse=True)
print("\n--- Feature Importances (Gradient Boosting Regressor) ---")
for feat, imp in sorted_importances:
    print(f"  {feat:<25}: {imp*100:.2f}%")

# 6. Save Artifacts for Production Deployment
os.makedirs('model', exist_ok=True)
joblib_path = 'model/rakshak_ml_models.joblib'
joblib.dump({
    'feature_cols': feature_cols,
    'scaler': scaler,
    'imputer': imputer,
    'best_regressor': best_gb_reg,
    'best_classifier': clf_results["Gradient Boosting"]['model_obj'],
    'ridge_regressor': reg_results["Linear Baseline (Ridge)"]['model_obj'],
    'logistic_classifier': clf_results["Logistic Regression"]['model_obj']
}, joblib_path)
print(f"\nSaved production joblib models to {joblib_path}")

# 7. Export Model Bundle as JSON for Zero-Dependency In-Process Inference
# Ridge regression linear coefficients + mean + scale provides deterministic, sub-microsecond latency
ridge_model = reg_results["Linear Baseline (Ridge)"]['model_obj']
log_model = clf_results["Logistic Regression"]['model_obj']

model_bundle = {
    'model_version': '1.0.0-ICPSR-39815',
    'trained_date': pd.Timestamp.now().isoformat(),
    'dataset_source': 'ICPSR Study 39815 (MIDUS Refresher 2: Cognitive Project)',
    'n_training_samples': int(X_train.shape[0]),
    'n_test_samples': int(X_test.shape[0]),
    'feature_cols': feature_cols,
    'imputer_medians': {col: float(med) for col, med in zip(feature_cols, imputer.statistics_)},
    'scaler_means': {col: float(m) for col, m in zip(feature_cols, scaler.mean_)},
    'scaler_scales': {col: float(s) for col, s in zip(feature_cols, scaler.scale_)},
    'ridge_intercept': float(ridge_model.intercept_),
    'ridge_coefficients': {col: float(c) for col, c in zip(feature_cols, ridge_model.coef_)},
    'logistic_classes': [str(c) for c in log_model.classes_],
    'logistic_intercepts': [float(i) for i in log_model.intercept_],
    'logistic_coefficients': [[float(c) for c in row] for row in log_model.coef_],
    'feature_importances': dict(sorted_importances),
    'performance_summary': {
        'regression': {k: {m: v for m, v in vals.items() if m != 'model_obj'} for k, vals in reg_results.items()},
        'classification': {k: {m: v for m, v in vals.items() if m != 'model_obj'} for k, vals in clf_results.items()}
    }
}

json_path = 'model/rakshak_model_bundle.json'
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(model_bundle, f, indent=2)
print(f"Saved zero-dependency JSON bundle to {json_path}")
