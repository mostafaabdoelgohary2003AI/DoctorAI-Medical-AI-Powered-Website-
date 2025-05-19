# Medical AI Diagnostics System Deployment Script for Windows

Write-Host "=== Medical AI Diagnostics System Deployment ===" -ForegroundColor Cyan
Write-Host "Starting deployment process..." -ForegroundColor Cyan

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Host "✓ Docker is installed." -ForegroundColor Green
} catch {
    Write-Host "Error: Docker is not installed. Please install Docker Desktop for Windows first." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
try {
    docker-compose --version | Out-Null
    Write-Host "✓ Docker Compose is installed." -ForegroundColor Green
} catch {
    Write-Host "Error: Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

# Setup environment variables if .env doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file with required variables..." -ForegroundColor Yellow
    @"
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
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✓ .env file created successfully." -ForegroundColor Green
} else {
    Write-Host "✓ .env file already exists. Skipping creation." -ForegroundColor Green
}

# Check for GPU support
Write-Host "Checking for NVIDIA GPU support..." -ForegroundColor Yellow
try {
    nvidia-smi | Out-Null
    Write-Host "✓ NVIDIA GPU detected. Enabling GPU support." -ForegroundColor Green
    $env:NVIDIA_VISIBLE_DEVICES = "all"
    $env:NVIDIA_DRIVER_CAPABILITIES = "compute,utility"
} catch {
    Write-Host "! No NVIDIA GPU detected. Using CPU only." -ForegroundColor Yellow
}

# Initialize models
Write-Host "Initializing AI models and cache..." -ForegroundColor Yellow
python -m api.core.model_init
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Models initialized successfully." -ForegroundColor Green
} else {
    Write-Host "! Warning: Model initialization may have issues." -ForegroundColor Yellow
}

# Check for Palm Disease model
Write-Host "Checking for Palm Disease model..." -ForegroundColor Yellow
if (Test-Path "XGB-Tuned-balancedPalm.pkl") {
    Write-Host "✓ Palm Disease model found." -ForegroundColor Green
} else {
    Write-Host "! Warning: Palm Disease model file 'XGB-Tuned-balancedPalm.pkl' not found in root directory." -ForegroundColor Yellow
    Write-Host "Please ensure the model file is available before proceeding." -ForegroundColor Yellow
    $continue_choice = Read-Host "Continue anyway? (y/n)"
    if ($continue_choice -ne "y") {
        Write-Host "Deployment aborted." -ForegroundColor Red
        exit 1
    }
}

# Build and start the containers
Write-Host "Building and starting containers..." -ForegroundColor Yellow
docker-compose build --no-cache
docker-compose up -d

# Wait for services to start
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if services are running
Write-Host "Checking if services are running..." -ForegroundColor Yellow
$services_running = docker-compose ps | Select-String "Up"
if ($services_running) {
    Write-Host "✓ Services are running." -ForegroundColor Green
    
    # Get the URLs
    $BACKEND_URL = "http://localhost:8000"
    $FRONTEND_URL = "http://localhost:3000"
    
    Write-Host "=== Deployment Complete! ===" -ForegroundColor Cyan
    Write-Host "Frontend URL: $FRONTEND_URL" -ForegroundColor Green
    Write-Host "Backend API URL: $BACKEND_URL" -ForegroundColor Green
    Write-Host "API Documentation: $BACKEND_URL/docs" -ForegroundColor Green
    Write-Host "Monitoring Metrics: $BACKEND_URL/metrics" -ForegroundColor Green
    
    # Verify deployment
    Write-Host "Verifying deployment..." -ForegroundColor Yellow
    
    # Check backend health
    Write-Host "Checking backend health..." -ForegroundColor Yellow
    try {
        $backend_response = Invoke-WebRequest -Uri "$BACKEND_URL/health" -UseBasicParsing -ErrorAction SilentlyContinue
        if ($backend_response.StatusCode -eq 200) {
            Write-Host "✓ Backend health check passed." -ForegroundColor Green
        } else {
            Write-Host "✗ Backend health check failed. Status code: $($backend_response.StatusCode)" -ForegroundColor Red
            Write-Host "View logs with: docker-compose logs -f backend" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "✗ Backend health check failed. Connection error." -ForegroundColor Red
        Write-Host "View logs with: docker-compose logs -f backend" -ForegroundColor Yellow
    }
    
    # Check frontend availability
    Write-Host "Checking frontend availability..." -ForegroundColor Yellow
    try {
        $frontend_response = Invoke-WebRequest -Uri $FRONTEND_URL -UseBasicParsing -ErrorAction SilentlyContinue
        if ($frontend_response.StatusCode -eq 200) {
            Write-Host "✓ Frontend check passed." -ForegroundColor Green
        } else {
            Write-Host "✗ Frontend check failed. Status code: $($frontend_response.StatusCode)" -ForegroundColor Red
            Write-Host "View logs with: docker-compose logs -f frontend" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "✗ Frontend check failed. Connection error." -ForegroundColor Red
        Write-Host "View logs with: docker-compose logs -f frontend" -ForegroundColor Yellow
    }
    
    # Run API healthcheck
    Write-Host "Running comprehensive API healthcheck..." -ForegroundColor Yellow
    python api/healthcheck.py
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ API healthcheck passed. System is ready for use." -ForegroundColor Green
    } else {
        Write-Host "✗ API healthcheck failed. Please check the logs for more information." -ForegroundColor Red
        Write-Host "View logs with: docker-compose logs -f backend" -ForegroundColor Yellow
    }
    
    # Check GPU utilization if available
    try {
        nvidia-smi | Out-Null
        Write-Host "Checking GPU utilization..." -ForegroundColor Yellow
        nvidia-smi
        Write-Host "For continuous monitoring, use: nvidia-smi -l 1" -ForegroundColor Cyan
    } catch {
        # GPU not available, skip this step
    }
} else {
    Write-Host "Error: Services failed to start. Please check the logs for more information." -ForegroundColor Red
    Write-Host "View logs with: docker-compose logs" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nDeployment script completed. Your Medical AI Diagnostics System should now be running." -ForegroundColor Cyan
Write-Host "To stop the system, run: docker-compose down" -ForegroundColor Cyan