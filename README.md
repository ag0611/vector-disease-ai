# VBD Intel — Vector-Borne Disease Intelligence Platform

> AI-powered disease surveillance and risk intelligence platform that predicts and visualizes vector-borne disease outbreaks across India.

**Brainwaves Hackathon 2026** | Domain: Health Tech / Public Health / AI & ML | Problem #3

---

## The Problem

Vector-borne diseases like Dengue, Malaria, Chikungunya, Japanese Encephalitis, and Zika are a major public health challenge across India. Outbreaks are driven by rainfall, temperature, humidity, population density, and historical disease patterns — but this data is fragmented across multiple sources.

Health authorities are forced to rely on delayed reports and reactive decision-making, making it hard to:

- Identify emerging hotspots before outbreaks escalate
- Prioritize interventions across states
- Efficiently allocate limited healthcare resources
- Predict risk in advance using environmental signals

---

## Our Solution

VBD Intel integrates real weather data, historical case records, and machine learning to deliver early risk prediction, hotspot identification, explainable AI insights, and actionable recommendations — all through a clean real-time dashboard.

---

## What We Built

### Backend — FastAPI + Python

8 REST API endpoints:

- `GET /api/dashboard` — Overall risk summary, alerts, trends
- `GET /api/map` — State-wise risk data, filterable by disease
- `GET /api/diseases` — Disease-wise overview (Dengue, Malaria, Chikungunya, JE)
- `GET /api/analytics` — Trend charts, state comparison, weather correlation
- `GET /api/hotspots` — Live state-level risk ranking
- `GET /api/alerts` — Active disease alerts
- `POST /api/predict` — ML-based risk prediction for any state/disease
- `POST /api/chat` — AI Assistant responses

### ML Pipeline — Trained on Real Data

- Dataset: `master_feature_dataset.csv` — 25,318 rows of real epidemiological data
- Features: temperature, humidity, daily_cases, population, humidity_lag_7, meantemp_lag_7, transmission_risk_index
- Random Forest Classifier — Risk Level (Low / Moderate / High / Critical) — Accuracy: 100%
- Gradient Boosting Regressor — Case count prediction — MAE: 0.00
- Models saved as `.pkl` files for fast inference

### Explainable AI

Every prediction includes a risk driver breakdown — Rainfall % | Humidity % | Historical Cases % | Temperature % | Population Density %

### Frontend — Next.js 14 + TypeScript

6 fully working pages:

- **Dashboard** — Overview stats, India heatmap, trends, alerts, state detail panel
- **India Map** — Interactive state grid with risk colors and state detail sidebar
- **Diseases** — Dengue, Malaria, Chikungunya, JE cards with YTD stats
- **Analytics** — Case trend, rainfall trend, risk timeline, state comparison, scatter chart
- **Hotspots** — Sortable and searchable state ranking table with alerts panel
- **AI Assistant** — Chat interface with suggested queries and real AI responses

---

## Datasets Used

| File | Description |
|---|---|
| master_feature_dataset.csv | Primary ML training data — 25K rows |
| india_dengue_large_cleaned.csv | 253K dengue patient records |
| india_malaria_cleaned.csv | State and district malaria data |
| india_chikungunya_cleaned.csv | Weekly chikungunya cases |
| district_demographics_cleaned.csv | Population data |
| weather_delhi_cleaned.csv | Weather time series |

---

## Methodology

1. **Data Collection** — Real epidemiological datasets + daily weather + district demographics
2. **Data Preprocessing** — Removed nulls, engineered lag features, computed transmission_risk_index
3. **Risk Score Formula** — 28% Humidity + 25% Cases + 20% Transmission Risk + 15% Temperature + 12% Population
4. **Risk Categorization** — 0–25: Low | 26–50: Moderate | 51–75: High | 76–100: Critical
5. **Model Training** — RandomForestClassifier + GradientBoostingRegressor, 80/20 split, serialized with joblib
6. **API Development** — FastAPI exposes predictions with full risk_drivers breakdown
7. **Frontend** — Next.js 14 dashboard with interactive charts, heatmap, and AI assistant

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Recharts, Lucide React, Axios |
| Backend | FastAPI, Uvicorn, SQLAlchemy, Pydantic, Python-dotenv |
| ML | Scikit-learn, XGBoost, Pandas, NumPy, Joblib |
| Database | SQLite via SQLAlchemy |
| Deployment | Vercel (Frontend), Render.com (Backend) |

---

##  Project Structure

```text
vector-disease-ai/
├── backend/              # FastAPI + ML models
├── frontend/             # Next.js 14 app
├── ml/                   # Training scripts and datasets
├── .gitignore
└── README.md
```

---

##  Setup Instructions

### Backend

```bash
cd backend

pip install -r requirements.txt

cp .env.example .env

uvicorn main:app --reload
```

### Frontend

```bash
cd frontend

npm install

cp .env.example .env.local

npm run dev
```
---

## Future Goals

**Short Term — 1 to 3 months**
- Real-time IMD weather API integration
- District-level predictions
- Push notifications and SMS alerts for high-risk states
- Mobile app via React Native
- Export reports as PDF or CSV

**Medium Term — 3 to 6 months**
- Satellite imagery for stagnant water detection
- GIS mapping with SVG/Leaflet interactive India map
- Multi-language support — Hindi and 6 regional languages
- NVBDCP government health API integration

**Long Term — 6 to 12 months**
- LSTM deep learning models for time-series outbreak prediction
- Hospital capacity system integration
- National early warning dashboard for Ministry of Health
- Community reporting and citizen science feature
- AUC-ROC automated model retraining pipeline

---

## Team and Project Info

- **Project:** VBD Intel — Vector-Borne Disease Intelligence Platform
- **Hackathon:** Brainwaves Hackathon 2026
- **Domain:** Health Tech / Public Health / AI & ML
- **Problem #:** 3
- **GitHub:** https://github.com/ag0611/vector-disease-ai
