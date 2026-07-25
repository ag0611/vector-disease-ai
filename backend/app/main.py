from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import dashboard, map, diseases, analytics, hotspots, predict, alerts, chat

app = FastAPI(title="VBD Intel API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(map.router)
app.include_router(diseases.router)
app.include_router(analytics.router)
app.include_router(hotspots.router)
app.include_router(predict.router)
app.include_router(alerts.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {"message": "VBD Intel API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}