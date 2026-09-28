#!/usr/bin/env python3
"""
Rakshak AI (रक्षक AI) - Deep Learning Stress Classification Model
Trains a TensorFlow/Keras neural network for multi-variate operational stress estimation
and exports frozen model and standardization matrices:
 - my_tensorflow_model.keras
 - scaler_mean.npy
 - scaler_scale.npy
"""

import os
import sys
import json

# Windows console encoding fix
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

print(f"TensorFlow Version: {tf.__version__}")
print(f"Keras Version: {keras.__version__}")

# Set reproducible random seed
np.random.seed(42)
tf.random.set_seed(42)

# Feature definitions
FEATURE_COLS = [
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

# Generate synthetic training cohort of N=3000 cases with empirical covariance
N = 3000
print(f"Synthesizing high-fidelity tactical dataset with N={N} personnel samples...")

sleep_hours = np.clip(np.random.normal(6.2, 1.4, N), 2.0, 10.0).round(1)
mood_score = np.clip(np.random.normal(3.2, 1.1, N), 1.0, 5.0).round(1)
resting_heart_rate = np.clip(68.0 + 3.0 * (7.0 - sleep_hours) + np.random.normal(0, 5.0, N), 50.0, 110.0).round(1)
hrv_ms = np.clip(58.0 - 2.8 * (7.0 - sleep_hours) + np.random.normal(0, 6.0, N), 15.0, 85.0).round(1)
days_since_last_leave = np.clip(np.random.exponential(scale=65, size=N), 5, 280).astype(int)
consecutive_field_days = np.clip(np.random.exponential(scale=45, size=N), 0, 180).astype(int)
night_duty_shifts = np.clip(np.random.poisson(lam=7, size=N), 0, 22).astype(int)
family_worry_score = np.clip(np.random.normal(3.8, 2.0, N), 1.0, 10.0).round(1)
family_emergency = (family_worry_score > 7.5).astype(int)
reported_symptoms_count = np.clip(np.random.poisson(lam=1.0, size=N) + (sleep_hours < 4.5)*1, 0, 5).astype(int)

# Cognitive / Autonomic factors
moca_score = np.clip(np.random.normal(18.2, 2.5, N), 8.0, 22.0).round(1)
reaction_time_s = np.clip(1.32 + 0.05 * (7.0 - sleep_hours) + np.random.normal(0, 0.2, N), 0.6, 2.8).round(3)
switch_cost_s = np.clip(0.35 + 0.06 * (7.0 - sleep_hours) + np.random.normal(0, 0.15, N), 0.05, 1.8).round(3)
backward_errors = np.clip(np.random.poisson(lam=1.2, size=N) + (sleep_hours < 4.0)*2, 0, 15).astype(int)

# Continuous Stress Score Ground Truth
raw_stress = (
    35.0
    + (3.5 - mood_score) * 6.5
    + (7.0 - sleep_hours) * 4.5
    + (resting_heart_rate - 65.0) * 0.4
    + (60.0 - hrv_ms) * 0.35
    + (days_since_last_leave / 180.0) * 15.0
    + (consecutive_field_days / 150.0) * 12.0
    + (night_duty_shifts / 15.0) * 8.0
    + (family_emergency * 8.0)
    + (reported_symptoms_count * 2.5)
    + (switch_cost_s * 6.0)
    + (backward_errors * 0.8)
    + np.random.normal(0, 3.0, N)
)

stress_percentage = np.clip(raw_stress, 5.0, 98.0).round(1)

# Categorical Stress Class:
# 0: Low Stress (< 40%)
# 1: Medium Stress (40% - 54.9%)
# 2: High Stress (55% - 69.9%)
# 3: Critical/Immediate Priority (>= 70%)
def get_stress_class(s):
    if s >= 70.0:
        return 3 # Critical / Immediate
    elif s >= 55.0:
        return 2 # High
    elif s >= 40.0:
        return 1 # Medium
    else:
        return 0 # Low

stress_classes = np.array([get_stress_class(s) for s in stress_percentage], dtype=np.int32)

# Build DataFrame
X_raw = np.column_stack([
    sleep_hours, mood_score, resting_heart_rate, hrv_ms,
    days_since_last_leave, consecutive_field_days, night_duty_shifts,
    family_worry_score, family_emergency, reported_symptoms_count,
    moca_score, reaction_time_s, switch_cost_s, backward_errors
])

# Train / Test Split
X_train, X_test, y_train_cls, y_test_cls, y_train_reg, y_test_reg = train_test_split(
    X_raw, stress_classes, stress_percentage, test_size=0.20, random_state=42, stratify=stress_classes
)

# Standardize Features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Save standardization matrices as required
print("Exporting standardization matrices (scaler_mean.npy, scaler_scale.npy)...")
np.save("scaler_mean.npy", scaler.mean_)
np.save("scaler_scale.npy", scaler.scale_)
print("  [OK] scaler_mean.npy saved (shape:", scaler.mean_.shape, ")")
print("  [OK] scaler_scale.npy saved (shape:", scaler.scale_.shape, ")")

# Save feature columns mapping
with open("feature_columns.json", "w", encoding="utf-8") as f:
    json.dump({
        "features": FEATURE_COLS,
        "class_labels": ["Low Priority", "Medium Priority", "High Priority", "Immediate Priority"]
    }, f, indent=2)

# Build TensorFlow / Keras Multi-Task Neural Network
print("Constructing Keras Neural Network Architecture...")
inputs = keras.Input(shape=(len(FEATURE_COLS),), name="input_features")
x = layers.Dense(64, activation="relu", kernel_initializer="he_normal")(inputs)
x = layers.BatchNormalization()(x)
x = layers.Dropout(0.2)(x)

x = layers.Dense(32, activation="relu")(x)
x = layers.BatchNormalization()(x)
x = layers.Dropout(0.15)(x)

x = layers.Dense(16, activation="relu")(x)

# Classification Output Head (Softmax 4 classes)
class_output = layers.Dense(4, activation="softmax", name="stress_class")(x)

# Regression Output Head (Linear continuous stress score)
score_output = layers.Dense(1, activation="linear", name="stress_score")(x)

model = keras.Model(inputs=inputs, outputs=[class_output, score_output], name="RakshakStressNN")

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.003),
    loss={
        "stress_class": "sparse_categorical_crossentropy",
        "stress_score": "mse"
    },
    loss_weights={
        "stress_class": 1.0,
        "stress_score": 0.05
    },
    metrics={
        "stress_class": ["accuracy"],
        "stress_score": ["mae"]
    }
)

model.summary()

# Train Model
print("\nExecuting Training Loops...")
callbacks = [
    keras.callbacks.EarlyStopping(monitor="val_loss", mode="min", patience=5, restore_best_weights=True)
]

history = model.fit(
    X_train_scaled,
    {"stress_class": y_train_cls, "stress_score": y_train_reg},
    validation_data=(X_test_scaled, {"stress_class": y_test_cls, "stress_score": y_test_reg}),
    epochs=20,
    batch_size=32,
    callbacks=callbacks,
    verbose=1
)

# Evaluate on Held-out Test Set
results = model.evaluate(X_test_scaled, {"stress_class": y_test_cls, "stress_score": y_test_reg}, verbose=0)
print("\n--- Test Set Evaluation Results ---")
for metric_name, val in zip(model.metrics_names, results):
    print(f"  {metric_name}: {val:.4f}")

# Save Frozen Keras Model
model_filename = "my_tensorflow_model.keras"
print(f"\nSaving frozen model to {model_filename}...")
model.save(model_filename)

if os.path.exists(model_filename):
    print(f"  [OK] {model_filename} successfully saved ({os.path.getsize(model_filename)} bytes).")
else:
    raise RuntimeError(f"Failed to verify {model_filename}")

print("\nModel Training & Verification Completed Successfully!")
