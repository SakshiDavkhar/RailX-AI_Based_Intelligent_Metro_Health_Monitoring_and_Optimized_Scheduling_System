
# RailX: AI-Driven Intelligent Metro Monitoring System

![RailX Banner](https://img.shields.io/badge/RailX-AI%20Powered-cyan?style=for-the-badge&logo=metro) 
![React](https://img.shields.io/badge/Frontend-React-blue?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)
![Python](https://img.shields.io/badge/AI-Python-yellow?style=flat-square&logo=python)

**RailX** is a next-generation predictive maintenance and scheduling platform designed for modern metro systems. By leveraging machine learning (Isolation Forests) on real-time sensor data, RailX predicts vehicle health scores and dynamically optimizes schedules to ensure passenger safety and operational efficiency.

---

## 🚀 Key Features

### 🧠 AI-Powered Health Scoring
-   **Real-time Anomaly Detection**: Uses a Random Forest/Isolation Forest model trained on `MetroPT3` dataset.
-   **Predictive Maintenance**: Identifies trains needing repair before failure occurs.
-   **Sensor Fusion**: Analyzes Oil Temperature, Pressure readings, and Motor Current simultaneously.

### 📊 Interactive Control Center
-   **Live Fleet Dashboard**: Visualize the status of all active trains in real-time.
-   **Rich Metrics**: Monitor critical parameters like `TP2`, `TP3` (Pressure), and `H1` signals.
-   **Modern UI**: Built with React & Tailwind CSS for a premium, dark-mode "Glassmorphism" aesthetic.

### 🗓️ Intelligent Scheduling
-   **Health-Aware Logistics**: Automatically filters out "Unhealthy" trains from the daily schedule.
-   **Optimized Timetables**: Generates round-robin schedules for the operational fleet.

---

## 🛠️ Technology Stack

| Component | Tech | Description |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | High-performance UI framework. |
| **Styling** | Tailwind CSS | Utility-first CSS for rapid, modern design. |
| **Backend** | FastAPI | High-speed Python web framework. |
| **AI/ML** | Scikit-Learn | Isolation Forest for anomaly detection. |
| **Data Viz** | Recharts | Composable charting library. |

---

## 📂 Project Structure

```bash
RailX/
├── backend/
│   ├── main.py              # FastAPI Application & Logic
│   └── requirements.txt     # Python Dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # UI Components
│   │   ├── Dashboard.jsx    # Main Monitoring View
│   │   └── Scheduler.jsx    # Scheduling View
│   └── tailwind.config.js   # Design Configuration
├── ml_pipeline/
│   ├── train_model.py       # ML Training Script
│   └── health_model.pkl     # Trained AI Model Artifact
└── Dataset/
    └── MetroPT3.csv         # Sensor Dataset
```

---

## ⚡ Getting Started

### Prerequisites
-   **Node.js** (v16+)
-   **Python** (v3.9+)

### 1. Setup Backend
The backend handles the AI inference and API requests.

```bash
cd backend
pip install -r requirements.txt
# Start the server
uvicorn main:app --reload
```
*API will run at `http://localhost:8000`*

### 2. Setup Frontend
The frontend provides the user interface.

```bash
cd frontend
npm install
# Start the development server
npm run dev
```
*App will run at `http://localhost:5173`*

### 3. Run ML Training (Optional)
If you want to retrain the model on new data:

```bash
# From root directory
python ml_pipeline/train_model.py
```

---

## 🔮 Future Roadmap
-   [ ] **Digital Twin**: 3D Visualization of Metro Coaches.
-   [ ] **Historical Analysis**: Long-term trend forecasting for component wear.
-   [ ] **Auth Integration**: Role-based access for Engineers vs. Station Masters.

---

**Developed with ❤️ for the Future of Transport.**
