#!/bin/bash

# Medical AI Diagnostics System Deployment Test Script
# This script tests the deployment process and verifies model paths

echo "=== Medical AI Diagnostics System Deployment Test ==="
echo "This script verifies the deployment configuration and model paths."
echo ""

# Check if all required model files exist
echo "Checking for required model files..."
required_models=(
    "DEPI_MONKEYPOX_MODEL.h5"
    "DEPI_SKIN_CANCER_MODEL.h5"
    "Model.h5"
    "Tumor.h5"
    "X-ray.h5"
    "XGB-Tuned-balancedPalm.pkl"
    "bone_fracture_model.h5"
    "best_weights2 epoch 6 acc 0.79 loss 0.95.keras"
)

missing_models=()
for model in "${required_models[@]}"; do
    if [ ! -f "$model" ]; then
        missing_models+=("$model")
        echo "✗ Model file not found: $model"
    else
        echo "✓ Model file found: $model"
    fi
done

if [ ${#missing_models[@]} -gt 0 ]; then
    echo -e "\nWarning: ${#missing_models[@]} model files are missing. Deployment may fail."
    read -p "Do you want to continue anyway? (y/n): " continue
    if [ "$continue" != "y" ]; then
        echo "Test aborted."
        exit 1
    fi
else
    echo -e "\nAll model files are present."
fi

# Check docker-compose.yml for correct model paths
echo -e "\nVerifying docker-compose.yml configuration..."
if [ ! -f "docker-compose.yml" ]; then
    echo "✗ docker-compose.yml not found!"
    exit 1
fi

for model in "${required_models[@]}"; do
    if ! grep -q "$model" docker-compose.yml; then
        echo "✗ Model '$model' not properly configured in docker-compose.yml"
    else
        echo "✓ Model '$model' correctly configured in docker-compose.yml"
    fi
done

# Check if Python and required modules are installed
echo -e "\nChecking Python installation..."
if command -v python3 &> /dev/null; then
    echo "✓ Python is installed."
    
    # Test model initialization module
    echo "Testing model initialization module..."
    if [ -f "api/core/model_init.py" ]; then
        echo "✓ Model initialization module found."
    else
        echo "✗ Model initialization module not found!"
    fi
else
    echo "✗ Python is not installed or not in PATH."
fi

# Check if .env file exists or can be created
echo -e "\nChecking .env configuration..."
if [ -f ".env" ]; then
    echo "✓ .env file exists."
    
    # Check for required variables
    required_vars=(
        "TF_FORCE_GPU_ALLOW_GROWTH"
        "API_PORT"
        "ENVIRONMENT"
        "MODEL_CACHE_SIZE"
    )
    
    for var in "${required_vars[@]}"; do
        if grep -q "$var" .env; then
            echo "✓ Environment variable '$var' is configured."
        else
            echo "✗ Environment variable '$var' is missing in .env file."
        fi
    done
else
    echo "! .env file does not exist, but will be created during deployment."
fi

# Check if deployment script exists
echo -e "\nChecking deployment scripts..."
if [ -f "deploy.ps1" ]; then
    echo "✓ Windows deployment script (deploy.ps1) found."
else
    echo "✗ Windows deployment script (deploy.ps1) not found!"
fi

if [ -f "deploy.sh" ]; then
    echo "✓ Linux deployment script (deploy.sh) found."
else
    echo "✗ Linux deployment script (deploy.sh) not found!"
fi

# Check if healthcheck script exists
echo -e "\nChecking API healthcheck script..."
if [ -f "api/healthcheck.py" ]; then
    echo "✓ API healthcheck script found."
else
    echo "✗ API healthcheck script not found!"
fi

# Summary
echo -e "\n=== Deployment Test Summary ==="
if [ ${#missing_models[@]} -gt 0 ]; then
    echo "! Warning: ${#missing_models[@]} model files are missing."
else
    echo "✓ All model files are present."
fi

echo -e "\nNext steps:"
echo "1. Run the deployment script: ./deploy.sh"
echo "2. Verify the deployment using the steps in DEPLOYMENT_STEPS.md"
echo "3. Monitor the system using: ./monitor_system.sh"

echo -e "\nFor detailed deployment instructions, refer to DEPLOYMENT_STEPS.md"