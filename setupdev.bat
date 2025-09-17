@echo off
echo Setting up backend...
cd backend
python -m venv env
call env\Scripts\activate
pip install -r requirements.txt
REM
alembic upgrade head
echo Seeding DB...
sqlite3 finance.db < seed_data.sql
cd ..

echo Setting up frontend...
cd frontend
npm install
cd ..

echo Setup complete.
pause
