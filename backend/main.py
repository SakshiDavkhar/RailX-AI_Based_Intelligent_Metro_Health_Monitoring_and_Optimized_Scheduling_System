
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os
import random
from typing import List

# Setup
app = FastAPI(title="RailX API", description="Metro Health Monitoring & Scheduling")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
MODEL_PATH = r"c:\Coding\Github\RailX-AI_Based_Intelligent_Metro_Health_Monitoring_and_Optimized_Scheduling_System\ml_pipeline\health_model.pkl"
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# In-memory storage for MVP
trains_db = []

class TrainInput(BaseModel):
    train_id: str
    tp2: float
    tp3: float
    h1: float
    dv_pressure: float
    reservoirs: float
    oil_temperature: float
    motor_current: float
    
class TrainData(TrainInput):
    health_score: float
    status: str

@app.get("/")
def read_root():
    return {"message": "RailX API Operational"}

@app.get("/trains")
def get_trains():
    return trains_db

@app.post("/trains/add")
def add_train(train: TrainInput):
    # Prepare features for model (must match training order)
    # Order: ['TP2', 'TP3', 'H1', 'DV_pressure', 'Reservoirs', 'Oil_temperature', 'Motor_current', 'COMP', 'DV_eletric', 'Towers', 'MPG', 'LPS', 'Pressure_switch', 'Oil_level', 'Caudal_impulses']
    # We will assume defaults for digital signals if not provided, or simply use the provided ones if we update the interface.
    # For MVP, we use the 7 core analog inputs and assume nominal digital values for a running train.
    
    features = [
        train.tp2, train.tp3, train.h1, train.dv_pressure, 
        train.reservoirs, train.oil_temperature, train.motor_current,
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0 # Defaults based on 'healthy' look from head of CSV
    ]
    
    score = 0
    status = "Unknown"
    
    if model:
        try:
            # Predict anomaly
            # Decision function: < 0 is anomaly, > 0 is normal. 
            # Range typically -0.5 to 0.5. We normalize to 0-100.
            raw_score = model.decision_function([features])[0]
            # Normalize: Let's map -0.2 (bad) to 0 and 0.2 (good) to 100 roughly
            normalized = (raw_score + 0.2) / 0.4 * 100
            score = max(0, min(100, normalized))
            
            status = "Optimal" if score > 70 else "Maintenance Required" if score < 40 else "Monitor"
        except Exception as e:
            print(f"Prediction Error: {e}")
            status = "Error"
    
    new_train = {
        **train.dict(),
        "health_score": round(score, 2),
        "status": status
    }
    trains_db.append(new_train)
    return new_train

@app.get("/schedule")
def generate_schedule():
    # scheduling logic: Round Robin for healthy trains
    healthy_trains = [t for t in trains_db if t['health_score'] > 40]
    
    if not healthy_trains:
        return {"schedule": [], "message": "No healthy trains available."}
    
    schedule = []
    # Create a 24-hour schedule (06:00 to 23:00) every 15 mins
    start_hour = 6
    end_hour = 23
    
    slots = []
    for h in range(start_hour, end_hour + 1):
        for m in [0, 15, 30, 45]:
            slots.append(f"{h:02d}:{m:02d}")
            
    # Assign
    train_idx = 0
    for slot in slots:
        train = healthy_trains[train_idx % len(healthy_trains)]
        schedule.append({
            "time": slot,
            "train_id": train['train_id'],
            "status": "Scheduled"
        })
        train_idx += 1
        
    return {"schedule": schedule}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
