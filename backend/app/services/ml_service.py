import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_absolute_error
import joblib
import os
from typing import Dict, Any

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_PATH = os.path.join(BASE_DIR, "..", "ml", "datasets", "master_feature_dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "..", "ml", "models")

class MLService:
    def __init__(self):
        self.risk_classifier = None
        self.case_predictor = None
        self.scaler = StandardScaler()
        self.feature_cols = ["meantemp", "humidity", "daily_cases", "population", "humidity_lag_7", "meantemp_lag_7", "transmission_risk_index"]
        self.is_trained = False
        self._initialize()

    def _initialize(self):
        os.makedirs(MODEL_DIR, exist_ok=True)
        clf_path = os.path.join(MODEL_DIR, "risk_classifier.pkl")
        reg_path = os.path.join(MODEL_DIR, "case_predictor.pkl")
        scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")

        if os.path.exists(clf_path) and os.path.exists(reg_path):
            self.risk_classifier = joblib.load(clf_path)
            self.case_predictor = joblib.load(reg_path)
            self.scaler = joblib.load(scaler_path)
            self.is_trained = True
            print("✅ ML models loaded from disk")
        else:
            print("🔄 Training ML models on real data...")
            self._train_on_real_data()

    def _compute_risk_score(self, temp, humidity, cases, population, transmission_risk):
        pop_density = population / 25.0 if population > 0 else 100
        risk = (
            0.28 * min(humidity / 100 * 100, 100) +
            0.25 * min(cases / 63 * 100, 100) +
            0.20 * min(transmission_risk_index / 1000 * 100, 100) if (transmission_risk_index := transmission_risk) else 0 +
            0.15 * min((temp - 15) / 25 * 100, 100) +
            0.12 * min(pop_density / 500 * 100, 100)
        )
        return float(np.clip(risk, 0, 100))

    def _train_on_real_data(self):
        try:
            df = pd.read_csv(DATASET_PATH)
            df = df.dropna(subset=["meantemp", "humidity", "daily_cases", "population", "transmission_risk_index"])

            df["risk_score"] = df.apply(lambda r: (
                0.28 * min(r["humidity"] / 100 * 100, 100) +
                0.25 * min(r["daily_cases"] / 63 * 100, 100) +
                0.20 * min(r["transmission_risk_index"] / 1000 * 100, 100) +
                0.15 * min((r["meantemp"] - 15) / 25 * 100, 100) +
                0.12 * min(r["population"] / 600000 * 100, 100)
            ), axis=1)
            df["risk_score"] = df["risk_score"].clip(0, 100)

            df["risk_level"] = pd.cut(df["risk_score"],
                bins=[0, 25, 50, 75, 100],
                labels=[0, 1, 2, 3],
                include_lowest=True
            ).astype(int)

            feature_cols = ["meantemp", "humidity", "daily_cases", "population",
                          "humidity_lag_7", "meantemp_lag_7", "transmission_risk_index"]
            X = df[feature_cols].values
            y_class = df["risk_level"].values
            y_reg = df["daily_cases"].values

            X_scaled = self.scaler.fit_transform(X)
            X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_class, test_size=0.2, random_state=42)

            self.risk_classifier = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
            self.risk_classifier.fit(X_train, y_train)
            acc = accuracy_score(y_test, self.risk_classifier.predict(X_test))
            print(f"✅ Risk Classifier Accuracy: {acc:.2%}")

            X_train2, X_test2, y_train2, y_test2 = train_test_split(X_scaled, y_reg, test_size=0.2, random_state=42)
            self.case_predictor = GradientBoostingRegressor(n_estimators=100, random_state=42)
            self.case_predictor.fit(X_train2, y_train2)
            mae = mean_absolute_error(y_test2, self.case_predictor.predict(X_test2))
            print(f"✅ Case Predictor MAE: {mae:.2f}")

            joblib.dump(self.risk_classifier, os.path.join(MODEL_DIR, "risk_classifier.pkl"))
            joblib.dump(self.case_predictor, os.path.join(MODEL_DIR, "case_predictor.pkl"))
            joblib.dump(self.scaler, os.path.join(MODEL_DIR, "scaler.pkl"))
            self.is_trained = True
            print("✅ Models saved to disk")

        except Exception as e:
            print(f"⚠️ Real data training failed: {e}. Falling back to synthetic.")
            self._train_synthetic()

    def _train_synthetic(self):
        np.random.seed(42)
        n = 5000
        temp = np.random.uniform(20, 40, n)
        humidity = np.random.uniform(40, 100, n)
        cases = np.random.randint(1, 64, n)
        population = np.random.randint(100000, 700000, n)
        hum_lag = humidity + np.random.normal(0, 5, n)
        temp_lag = temp + np.random.normal(0, 2, n)
        trans_risk = humidity * cases * 0.5 + np.random.normal(0, 50, n)

        risk_score = (0.28*(humidity/100*100) + 0.25*(cases/63*100) + 0.20*(trans_risk/2000*100) + 0.15*((temp-15)/25*100) + 0.12*(population/700000*100)).clip(0,100)
        risk_level = np.where(risk_score < 25, 0, np.where(risk_score < 50, 1, np.where(risk_score < 75, 2, 3)))

        X = np.column_stack([temp, humidity, cases, population, hum_lag, temp_lag, trans_risk])
        X_scaled = self.scaler.fit_transform(X)

        self.risk_classifier = RandomForestClassifier(n_estimators=100, random_state=42)
        self.risk_classifier.fit(X_scaled, risk_level)
        self.case_predictor = GradientBoostingRegressor(n_estimators=100, random_state=42)
        self.case_predictor.fit(X_scaled, cases)
        self.is_trained = True

    def predict(self, temperature: float, humidity: float, rainfall: float,
                population_density: float, historical_cases: int) -> Dict[str, Any]:
        hum_lag = humidity * 0.95
        temp_lag = temperature * 0.98
        population = int(population_density * 25)
        trans_risk = humidity * historical_cases * 0.5

        X = np.array([[temperature, humidity, historical_cases, population, hum_lag, temp_lag, trans_risk]])
        X_scaled = self.scaler.transform(X)

        risk_level_idx = int(self.risk_classifier.predict(X_scaled)[0])
        risk_proba = self.risk_classifier.predict_proba(X_scaled)[0]
        predicted_cases = max(1, int(self.case_predictor.predict(X_scaled)[0]))

        risk_score = (
            0.28 * min(humidity / 100 * 100, 100) +
            0.25 * min(historical_cases / 63 * 100, 100) +
            0.20 * min(trans_risk / 2000 * 100, 100) +
            0.15 * min((temperature - 15) / 25 * 100, 100) +
            0.12 * min(population_density / 500 * 100, 100)
        )
        risk_score = float(np.clip(risk_score, 0, 100))
        confidence = float(max(risk_proba))

        risk_levels = ["Low", "Moderate", "High", "Critical"]
        risk_level_str = risk_levels[min(risk_level_idx, 3)]

        total = risk_score if risk_score > 0 else 1
        hum_c = round(0.28 * min(humidity/100*100, 100) / total * 100, 1)
        case_c = round(0.25 * min(historical_cases/63*100, 100) / total * 100, 1)
        trans_c = round(0.20 * min(trans_risk/2000*100, 100) / total * 100, 1)
        temp_c = round(0.15 * min((temperature-15)/25*100, 100) / total * 100, 1)
        pop_c = round(max(0, 100 - hum_c - case_c - trans_c - temp_c), 1)

        return {
            "risk_score": round(risk_score, 1),
            "risk_level": risk_level_str,
            "confidence": round(confidence, 2),
            "predicted_cases": predicted_cases,
            "risk_drivers": {
                "Humidity": hum_c,
                "Historical cases": case_c,
                "Transmission risk": trans_c,
                "Temperature": temp_c,
                "Population density": pop_c
            }
        }

ml_service = MLService()