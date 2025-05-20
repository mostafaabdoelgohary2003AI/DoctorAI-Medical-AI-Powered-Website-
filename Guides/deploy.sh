#!/bin/bash

echo "=== Medical AI Diagnostics System Deployment ==="
echo "Starting deployment process..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Setup environment variables if .env doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file with required variables..."
    cat > .env << EOL
TF_FORCE_GPU_ALLOW_GROWTH=true
TF_CPP_MIN_LOG_LEVEL=2
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=development
JWT_SECRET=your_secret_key
JWT_EXPIRATION_MINUTES=30
ENABLE_PROMETHEUS=true
MODEL_CACHE_SIZE=5
MODEL_TIMEOUT_SECONDS=30
EOL
    echo ".env file created successfully."
else
    echo ".env file already exists. Skipping creation."
fi

# Check for GPU support
echo "Checking for NVIDIA GPU support..."
if command -v nvidia-smi &> /dev/null; then
    echo "NVIDIA GPU detected. Enabling GPU support."
    export NVIDIA_VISIBLE_DEVICES=all
    export NVIDIA_DRIVER_CAPABILITIES=compute,utility
else
    echo "No NVIDIA GPU detected. Using CPU only."
fi

# Initialize models
echo "Initializing AI models and cache..."
python -m api.core.model_init

# Check for Palm Disease model
echo "Checking for Palm Disease model..."
if [ -f "XGB-Tuned-balancedPalm.pkl" ]; then
    echo "Palm Disease model found."
else
    echo "Warning: Palm Disease model file 'XGB-Tuned-balancedPalm.pkl' not found in root directory."
    echo "Please ensure the model file is available before proceeding."
    read -p "Continue anyway? (y/n): " continue_choice
    if [ "$continue_choice" != "y" ]; then
        echo "Deployment aborted."
        exit 1
    fi
fi

# Build and start the containers
echo "Building and starting containers..."
docker-compose build --no-cache
docker-compose up -d

# Wait for services to start
echo "Waiting for services to start..."
sleep 10

# Check if services are running
echo "Checking if services are running..."
if docker-compose ps | grep -q "Up"; then
    echo "Services are running."
    
    # Get the URLs
    BACKEND_URL="http://localhost:8000"
    FRONTEND_URL="http://localhost:3000"
    
    echo "=== Deployment Complete! ==="
    echo "Frontend URL: $FRONTEND_URL"
    echo "Backend API URL: $BACKEND_URL"
    echo "API Documentation: $BACKEND_URL/docs"
    echo "Monitoring Metrics: $BACKEND_URL/metrics"
    
    # Verify deployment
echo "Verifying deployment..."

# Check backend health
echo "Checking backend health..."
backend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health)
if [ "$backend_health" == "200" ]; then
    echo "✅ Backend health check passed."
else
    echo "❌ Backend health check failed. Status code: $backend_health"
    echo "View logs with: docker-compose logs -f backend"
fi

# Check frontend availability
echo "Checking frontend availability..."
frontend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$frontend_health" == "200" ]; then
    echo "✅ Frontend check passed."
else
    echo "❌ Frontend check failed. Status code: $frontend_health"
    echo "View logs with: docker-compose logs -f frontend"
fi

# Run API healthcheck
echo "Running comprehensive API healthcheck..."
python api/healthcheck.py

if [ $? -eq 0 ]; then
    echo "✅ API healthcheck passed. System is ready for use."
else
    echo "❌ API healthcheck failed. Please check the logs for more information."
    echo "View logs with: docker-compose logs -f backend"
fi

# Check GPU utilization if available
if command -v nvidia-smi &> /dev/null; then
    echo "Checking GPU utilization..."
    nvidia-smi
    echo "For continuous monitoring, use: nvidia-smi -l 1"
fi
else
    echo "Error: Services failed to start. Please check the logs for more information."
    echo "View logs with: docker-compose logs"
    exit 1
fi