#!/bin/sh
set -e

echo "Initializing database tables..."
python scripts/init_db.py

echo "Starting uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers ${WORKERS:-2}
