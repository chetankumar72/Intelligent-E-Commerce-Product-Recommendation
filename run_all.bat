@echo off
title NexaShop AI - Launcher
echo ========================================================
echo Launching Intelligent E-Commerce Product Recommendation System
echo ========================================================
echo Starting Frontend (Vite) in a new window...
start "NexaShop AI - Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo Starting Backend (FastAPI) in a new window...
start "NexaShop AI - Backend (Port 8000)" cmd /k "cd backend && .\.venv\Scripts\python.exe main.py"

echo ========================================================
echo Both servers started!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://127.0.0.1:8000/docs
echo ========================================================
timeout /t 5

