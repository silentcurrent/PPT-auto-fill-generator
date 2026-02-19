@echo off
echo Installing/Updating dependencies...
pip install -r requirements.txt

echo.
echo Starting backend server on port 8000...
python main.py
