#!/bin/bash

# Initialize models first
echo "Initializing models..."
python -m core.model_init

# Check if initialization was successful
if [ $? -ne 0 ]; then
    echo "Model initialization failed. Please check the logs."
    exit 1
fi

echo "Starting API server..."

# Check if we should use Gunicorn (production) or Uvicorn (development)
if [ "$ENVIRONMENT" = "production" ]; then
    # Start with Gunicorn for production (multiple workers)
    gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
else
    # Start with Uvicorn for development (auto-reload)
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
fi