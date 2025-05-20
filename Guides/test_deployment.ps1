# Medical AI Diagnostics System Deployment Test Script
# This script tests the deployment process and verifies model paths

Write-Host "=== Medical AI Diagnostics System Deployment Test ===" -ForegroundColor Cyan
Write-Host "This script verifies the deployment configuration and model paths." -ForegroundColor Cyan
Write-Host ""

# Check if all required model files exist
Write-Host "Checking for required model files..." -ForegroundColor Yellow
$required_models = @(
    "DEPI_MONKEYPOX_MODEL.h5",
    "DEPI_SKIN_CANCER_MODEL.h5",
    "Model.h5",
    "Tumor.h5",
    "X-ray.h5",
    "XGB-Tuned-balancedPalm.pkl",
    "bone_fracture_model.h5",
    "best_weights2 epoch 6 acc 0.79 loss 0.95.keras"
)

$missing_models = @()
foreach ($model in $required_models) {
    if (-not (Test-Path $model)) {
        $missing_models += $model
        Write-Host "✗ Model file not found: $model" -ForegroundColor Red
    } else {
        Write-Host "✓ Model file found: $model" -ForegroundColor Green
    }
}

if ($missing_models.Count -gt 0) {
    Write-Host "\nWarning: $($missing_models.Count) model files are missing. Deployment may fail." -ForegroundColor Yellow
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Test aborted." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "\nAll model files are present." -ForegroundColor Green
}

# Check docker-compose.yml for correct model paths
Write-Host "\nVerifying docker-compose.yml configuration..." -ForegroundColor Yellow
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "✗ docker-compose.yml not found!" -ForegroundColor Red
    exit 1
}

$docker_compose = Get-Content "docker-compose.yml" -Raw
foreach ($model in $required_models) {
    if ($docker_compose -notmatch [regex]::Escape($model)) {
        Write-Host "✗ Model '$model' not properly configured in docker-compose.yml" -ForegroundColor Red
    } else {
        Write-Host "✓ Model '$model' correctly configured in docker-compose.yml" -ForegroundColor Green
    }
}

# Check if Python and required modules are installed
Write-Host "\nChecking Python installation..." -ForegroundColor Yellow
try {
    python --version | Out-Null
    Write-Host "✓ Python is installed." -ForegroundColor Green
    
    # Test model initialization module
    Write-Host "Testing model initialization module..." -ForegroundColor Yellow
    if (Test-Path "api\core\model_init.py") {
        Write-Host "✓ Model initialization module found." -ForegroundColor Green
    } else {
        Write-Host "✗ Model initialization module not found!" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Python is not installed or not in PATH." -ForegroundColor Red
}

# Check if .env file exists or can be created
Write-Host "\nChecking .env configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ .env file exists." -ForegroundColor Green
    
    # Check for required variables
    $env_content = Get-Content ".env" -Raw
    $required_vars = @(
        "TF_FORCE_GPU_ALLOW_GROWTH",
        "API_PORT",
        "ENVIRONMENT",
        "MODEL_CACHE_SIZE"
    )
    
    foreach ($var in $required_vars) {
        if ($env_content -match $var) {
            Write-Host "✓ Environment variable '$var' is configured." -ForegroundColor Green
        } else {
            Write-Host "✗ Environment variable '$var' is missing in .env file." -ForegroundColor Red
        }
    }
} else {
    Write-Host "! .env file does not exist, but will be created during deployment." -ForegroundColor Yellow
}

# Check if deployment script exists
Write-Host "\nChecking deployment scripts..." -ForegroundColor Yellow
if (Test-Path "deploy.ps1") {
    Write-Host "✓ Windows deployment script (deploy.ps1) found." -ForegroundColor Green
} else {
    Write-Host "✗ Windows deployment script (deploy.ps1) not found!" -ForegroundColor Red
}

if (Test-Path "deploy.sh") {
    Write-Host "✓ Linux deployment script (deploy.sh) found." -ForegroundColor Green
} else {
    Write-Host "✗ Linux deployment script (deploy.sh) not found!" -ForegroundColor Red
}

# Check if healthcheck script exists
Write-Host "\nChecking API healthcheck script..." -ForegroundColor Yellow
if (Test-Path "api\healthcheck.py") {
    Write-Host "✓ API healthcheck script found." -ForegroundColor Green
} else {
    Write-Host "✗ API healthcheck script not found!" -ForegroundColor Red
}

# Summary
Write-Host "\n=== Deployment Test Summary ===" -ForegroundColor Cyan
if ($missing_models.Count -gt 0) {
    Write-Host "! Warning: $($missing_models.Count) model files are missing." -ForegroundColor Yellow
} else {
    Write-Host "✓ All model files are present." -ForegroundColor Green
}

Write-Host "\nNext steps:" -ForegroundColor Cyan
Write-Host "1. Run the deployment script: .\deploy.ps1" -ForegroundColor White
Write-Host "2. Verify the deployment using the steps in DEPLOYMENT_STEPS.md" -ForegroundColor White
Write-Host "3. Monitor the system using: .\monitor_system.ps1" -ForegroundColor White

Write-Host "\nFor detailed deployment instructions, refer to DEPLOYMENT_STEPS.md" -ForegroundColor Cyan