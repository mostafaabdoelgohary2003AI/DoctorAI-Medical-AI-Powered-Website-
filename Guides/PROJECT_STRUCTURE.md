# Medical AI Diagnostics System: Project Structure

## Overview

This document outlines the standardized project structure for the Medical AI Diagnostics System (DEPI). The system is designed to provide AI-powered diagnostics for various medical conditions using different machine learning models.

## Directory Structure

```
/
├── api/                           # Backend API service
│   ├── core/                      # Core functionality
│   │   └── model_init.py          # Model initialization
│   ├── model_registry/            # Model metadata
│   │   ├── bone_fracture/
│   │   ├── chatbot/
│   │   ├── lung_colon/
│   │   ├── monkeypox/
│   │   ├── palm_disease/
│   │   ├── skin_cancer/
│   │   ├── tumor/
│   │   └── xray/
│   ├── models/                    # Model implementation
│   │   ├── bone_fracture.py
│   │   ├── chatbot.py
│   │   ├── lung_colon.py
│   │   ├── monkeypox.py
│   │   ├── palm_disease.py
│   │   ├── skin_cancer.py
│   │   ├── tumor.py
│   │   └── xray.py
│   ├── schemas/                   # Data validation schemas
│   ├── tests/                     # API tests
│   └── utils/                     # Utility functions
│       ├── image_processing.py
│       ├── model_loader.py
│       ├── monitoring.py
│       ├── security.py
│       └── text_processing.py
├── project/                       # Frontend application
│   ├── public/                    # Static assets
│   ├── src/                       # Source code
│   │   ├── assets/                # Frontend assets
│   │   ├── components/            # React components
│   │   ├── layouts/               # Page layouts
│   │   ├── pages/                 # Application pages
│   │   ├── services/              # API service clients
│   │   └── store/                 # State management
│   └── project/                   # Additional project files
├── docker/                        # Docker configuration
│   └── api.Dockerfile             # API container definition
├── model_registry/                # Global model registry
└── tests/                         # System tests
```

## Model Files

The following model files must be present in the root directory for deployment:

| Model File | Description |
|------------|-------------|
| `DEPI_MONKEYPOX_MODEL.h5` | Monkeypox detection model |
| `DEPI_SKIN_CANCER_MODEL.h5` | Skin cancer detection model |
| `Model.h5` | Lung-colon cancer model |
| `Tumor.h5` | Tumor detection model |
| `X-ray.h5` | X-ray analysis model |
| `XGB-Tuned-balancedPalm.pkl` | Palm disease detection model |
| `bone_fracture_model.h5` | Bone fracture detection model |
| `best_weights2 epoch 6 acc 0.79 loss 0.95.keras` | Medical Chatbot Model |

## Configuration Files

| File | Description |
|------|-------------|
| `.env` | Environment variables for both frontend and backend |
| `docker-compose.yml` | Docker services configuration |
| `deploy.sh` / `deploy.ps1` | Deployment scripts |
| `test_deployment.sh` / `test_deployment.ps1` | Deployment testing scripts |
| `monitor_system.sh` / `monitor_system.ps1` | System monitoring scripts |

## Deployment Documentation

The following documentation files provide guidance for deployment and maintenance:

- `DEPLOYMENT_GUIDE.md` - General deployment guide
- `DEPLOYMENT_STEPS.md` - Step-by-step deployment instructions
- `DEPLOYMENT_TESTING.md` - Testing procedures for deployment
- `MONITORING_GUIDE.md` - System monitoring instructions

## Docker Configuration

The system uses Docker for containerization with two main services:

1. **Backend Service**
   - Exposes port 8000
   - Mounts all model files into the container
   - Configurable via environment variables

2. **Frontend Service**
   - Exposes port 3000
   - Connects to the backend API
   - Built with React and Vite

## Environment Variables

Key environment variables used by the system:

- `TF_FORCE_GPU_ALLOW_GROWTH` - Controls TensorFlow GPU memory allocation
- `API_HOST` - Backend API host
- `API_PORT` - Backend API port
- `ENVIRONMENT` - Deployment environment (development/production)
- `JWT_SECRET` - Secret for JWT authentication
- `MODEL_CACHE_SIZE` - Number of models to keep in memory
- `MODEL_TIMEOUT_SECONDS` - Timeout for model inference

## Deployment Requirements

1. Docker and Docker Compose installed
2. All model files present in the root directory
3. Properly configured `.env` file
4. Sufficient system resources for running multiple ML models

## Troubleshooting

If deployment issues occur:

1. Ensure all model files are present in the root directory
2. Verify that the `docker-compose.yml` file contains the correct volume mounts
3. Check that required environment variables are set in the `.env` file
4. Refer to `DEPLOYMENT_TESTING.md` for detailed troubleshooting steps