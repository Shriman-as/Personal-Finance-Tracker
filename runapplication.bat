@echo off
echo Starting backend...
cd backend
call vnv\Scripts\activate
start cmd /k "uvicorn app.main:app --reload --port 8000"
cd ..

echo Starting frontend...
cd frontend
start cmd /k "npm start"
cd ..

echo running testcase....
pytest tests/tests_core.py -v --maxfail=1 --disable-warnings
