# Medical AI System Monitoring Script

Write-Host "=== Medical AI System Monitoring ===" -ForegroundColor Cyan
Write-Host "This script helps monitor the health and performance of your deployed Medical AI system." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    $docker_status = docker ps 2>&1
    Write-Host "✓ Docker is running." -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check container status
Write-Host "\nChecking container status..." -ForegroundColor Yellow
docker-compose ps

# Define URLs
$BACKEND_URL = "http://localhost:8000"
$FRONTEND_URL = "http://localhost:3000"

# Check backend health
Write-Host "\nChecking backend health..." -ForegroundColor Yellow
try {
    $backend_response = Invoke-WebRequest -Uri "$BACKEND_URL/health" -UseBasicParsing -ErrorAction SilentlyContinue
    if ($backend_response.StatusCode -eq 200) {
        Write-Host "✓ Backend health check passed." -ForegroundColor Green
    } else {
        Write-Host "✗ Backend health check failed. Status code: $($backend_response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Backend health check failed. Connection error." -ForegroundColor Red
}

# Check frontend availability
Write-Host "\nChecking frontend availability..." -ForegroundColor Yellow
try {
    $frontend_response = Invoke-WebRequest -Uri $FRONTEND_URL -UseBasicParsing -ErrorAction SilentlyContinue
    if ($frontend_response.StatusCode -eq 200) {
        Write-Host "✓ Frontend check passed." -ForegroundColor Green
    } else {
        Write-Host "✗ Frontend check failed. Status code: $($frontend_response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Frontend check failed. Connection error." -ForegroundColor Red
}

# Check GPU utilization if available
Write-Host "\nChecking GPU utilization..." -ForegroundColor Yellow
try {
    nvidia-smi
    Write-Host "\nFor continuous GPU monitoring, run: nvidia-smi -l 1" -ForegroundColor Cyan
} catch {
    Write-Host "No NVIDIA GPU detected or nvidia-smi not available." -ForegroundColor Yellow
}

# Check container resource usage
Write-Host "\nChecking container resource usage..." -ForegroundColor Yellow
docker stats --no-stream

# Check Prometheus metrics
Write-Host "\nChecking Prometheus metrics..." -ForegroundColor Yellow
try {
    $metrics_response = Invoke-WebRequest -Uri "$BACKEND_URL/metrics" -UseBasicParsing -ErrorAction SilentlyContinue
    if ($metrics_response.StatusCode -eq 200) {
        Write-Host "✓ Prometheus metrics available." -ForegroundColor Green
        Write-Host "  View metrics at: $BACKEND_URL/metrics" -ForegroundColor Cyan
        
        # Extract and display some key metrics
        $metrics_content = $metrics_response.Content
        
        Write-Host "\nKey Performance Metrics:" -ForegroundColor Yellow
        
        # Extract HTTP request duration metrics if they exist
        if ($metrics_content -match "http_request_duration_seconds") {
            Write-Host "  HTTP Request Duration metrics available" -ForegroundColor Green
        }
        
        # Extract model inference time metrics if they exist
        if ($metrics_content -match "model_inference_time") {
            Write-Host "  Model Inference Time metrics available" -ForegroundColor Green
        }
    } else {
        Write-Host "✗ Prometheus metrics check failed. Status code: $($metrics_response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Prometheus metrics check failed. Connection error." -ForegroundColor Red
    Write-Host "  Check if ENABLE_PROMETHEUS=true in your .env file" -ForegroundColor Yellow
}

# Check model cache status
Write-Host "\nChecking model cache status..." -ForegroundColor Yellow
try {
    $cache_response = Invoke-WebRequest -Uri "$BACKEND_URL/api/system/cache-status" -UseBasicParsing -ErrorAction SilentlyContinue
    if ($cache_response.StatusCode -eq 200) {
        Write-Host "✓ Model cache status available." -ForegroundColor Green
        $cache_data = $cache_response.Content | ConvertFrom-Json
        Write-Host "  Cache Size: $($cache_data.cache_size)" -ForegroundColor Cyan
        Write-Host "  Cached Models: $($cache_data.cached_models -join ', ')" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Model cache status check failed. Status code: $($cache_response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Model cache status check failed. Connection error." -ForegroundColor Red
    Write-Host "  The cache status endpoint may not be implemented." -ForegroundColor Yellow
}

# Check logs for errors
Write-Host "\nChecking for errors in logs..." -ForegroundColor Yellow
docker-compose logs --tail=50 backend | Select-String -Pattern "ERROR", "Exception", "Failed"

Write-Host "\n=== Monitoring Complete ===" -ForegroundColor Cyan
Write-Host "For detailed logs, run: docker-compose logs -f" -ForegroundColor Cyan
Write-Host "For API documentation, visit: $BACKEND_URL/docs" -ForegroundColor Cyan
Write-Host "For continuous monitoring, consider setting up Prometheus with Grafana" -ForegroundColor Cyan