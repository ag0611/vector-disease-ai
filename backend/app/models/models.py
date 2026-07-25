from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class State(Base):
    __tablename__ = "states"
    id = Column(Integer, primary_key=True, index=True)
    state_name = Column(String, unique=True, index=True)
    state_code = Column(String(5))
    latitude = Column(Float)
    longitude = Column(Float)
    population = Column(Integer)
    cases = relationship("Case", back_populates="state")
    weather = relationship("Weather", back_populates="state")
    predictions = relationship("Prediction", back_populates="state")
    alerts = relationship("Alert", back_populates="state")

class Disease(Base):
    __tablename__ = "diseases"
    id = Column(Integer, primary_key=True, index=True)
    disease_name = Column(String, unique=True, index=True)
    disease_code = Column(String(10))
    description = Column(Text)
    vector = Column(String)
    cases = relationship("Case", back_populates="disease")
    predictions = relationship("Prediction", back_populates="disease")
    alerts = relationship("Alert", back_populates="disease")

class Weather(Base):
    __tablename__ = "weather"
    id = Column(Integer, primary_key=True, index=True)
    state_id = Column(Integer, ForeignKey("states.id"))
    date = Column(DateTime, default=datetime.utcnow)
    temperature = Column(Float)
    humidity = Column(Float)
    rainfall = Column(Float)
    state = relationship("State", back_populates="weather")

class Case(Base):
    __tablename__ = "cases"
    id = Column(Integer, primary_key=True, index=True)
    state_id = Column(Integer, ForeignKey("states.id"))
    disease_id = Column(Integer, ForeignKey("diseases.id"))
    date = Column(DateTime, default=datetime.utcnow)
    total_cases = Column(Integer)
    state = relationship("State", back_populates="cases")
    disease = relationship("Disease", back_populates="cases")

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    state_id = Column(Integer, ForeignKey("states.id"))
    disease_id = Column(Integer, ForeignKey("diseases.id"))
    date = Column(DateTime, default=datetime.utcnow)
    risk_score = Column(Float)
    confidence = Column(Float)
    predicted_cases = Column(Integer)
    risk_level = Column(String)
    state = relationship("State", back_populates="predictions")
    disease = relationship("Disease", back_populates="predictions")

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    state_id = Column(Integer, ForeignKey("states.id"))
    disease_id = Column(Integer, ForeignKey("diseases.id"))
    severity = Column(String)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    state = relationship("State", back_populates="alerts")
    disease = relationship("Disease", back_populates="alerts")