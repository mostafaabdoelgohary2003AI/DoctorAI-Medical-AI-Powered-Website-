# Medical AI Diagnostics System: Step-by-Step Deployment Guide

This guide provides a detailed walkthrough for deploying the Medical AI Diagnostics System, including verification steps and troubleshooting procedures.

## Prerequisites

- Windows or Linux operating system
- Docker and Docker Compose installed
- Python 3.7+ installed
- NVIDIA GPU with CUDA support (optional, for GPU acceleration)
- NVIDIA drivers and nvidia-docker (if using GPU)

## Pre-Deployment Checklist

### 1. Verify Model Files

> **IMPORTANT**: Due to their large size (>200MB each), model files are not directly included in the GitHub repository. Follow these steps to obtain them:

#### Option A: Download Using the Script

Run the provided script to download all model files from our storage server:

```bash
python download_models.py
```

#### Option B: Manual Download

If you have access to the model files through other means, ensure all of the following files are present in the root directory:

- `DEPI_MONKEYPOX_MODEL.h5`
- `DEPI_SKIN_CANCER_MODEL.h5`
- `Model.h5`
- `Tumor.h5`
- `X-ray.h5`
- `XGB-Tuned-balancedPalm.pkl`
- `bone_fracture_model.h5`
- `best_weights2 epoch 6 acc 0.79 loss 0.95.keras`

#### For Contributors: Using Git LFS

If you're contributing to this project and need to work with the model files, please refer to the [Git LFS Setup Guide](./GIT_LFS_SETUP.md) for instructions on handling large files with Git.

### 2. Verify Docker-Compose Configuration

Check that all model paths in `docker-compose.yml` are correctly configured. The volume mounts should match the model filenames exactly.

### 3. Verify API Configuration

Ensure the API configuration in `.env` file is correct. If the file doesn't exist, it will be created during deployment.

## Deployment Steps

### Windows Deployment

1. Open PowerShell as Administrator
2. Navigate to the project directory
3. Run the deployment script:

```powershell
.\deploy.ps1
```

### Linux Deployment

1. Open a terminal
2. Navigate to the project directory
3. Make the deployment script executable and run it:

```bash
chmod +x deploy.sh
./deploy.sh
```

## Post-Deployment Verification

### 1. Verify Container Status

Check that both containers are running:

```bash
docker-compose ps
```

Both services should show as "Up" with health status "healthy".

### 2. Verify Backend Health

Access the health endpoint to verify the backend is functioning:

```bash
curl http://localhost:8000/health
```

Or open in a browser: http://localhost:8000/health

### 3. Verify Frontend Availability

Open the frontend in a browser:

http://localhost:3000

### 4. Run Comprehensive API Healthcheck

Run the Python healthcheck script to verify all model endpoints:

```bash
python api/healthcheck.py
```

### 5. Verify GPU Utilization (if applicable)

If using a GPU, check that it's being utilized:

```bash
nvidia-smi
```

For continuous monitoring:

```bash
nvidia-smi -l 1
```

## Monitoring the System

After deployment, you can monitor the system using the provided monitoring script:

### Windows

```powershell
.\monitor_system.ps1
```

### Linux

```bash
chmod +x monitor_system.sh
./monitor_system.sh
```

## Troubleshooting

### Container Issues

If containers fail to start or show health issues:

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Model Initialization Issues

If models fail to initialize:

```bash
python -m api.core.model_init --verbose
```

### API Connection Issues

If the frontend cannot connect to the backend:

1. Verify the backend is running: `curl http://localhost:8000/health`
2. Check that the frontend environment variable `VITE_API_URL` is set correctly in `.env`
3. Inspect browser console for CORS or connection errors

### GPU Issues

If GPU acceleration is not working:

1. Verify NVIDIA drivers are installed: `nvidia-smi`
2. Check that Docker is configured for GPU support
3. Verify TensorFlow is using the GPU: Check backend logs for GPU detection messages

## Accessing the System

After successful deployment, you can access the system at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Monitoring Metrics**: http://localhost:8000/metrics

## Stopping the System

To stop the system and shut down all containers:

```bash
docker-compose down
```

## Additional Notes

### Model Cache

The system uses an LRU cache for models to improve performance. The cache size is configured in the `.env` file with the `MODEL_CACHE_SIZE` variable.

### API Endpoints

All model prediction endpoints follow the format: `/api/predict/{model-name}`

For example:
- `/api/predict/skin-cancer`
- `/api/predict/brain-tumor`
- `/api/predict/palm-disease`

### Frontend-Backend Communication

The frontend communicates with the backend via the API URL specified in the `.env` file. Ensure this URL is accessible from the frontend container.

### Bilingual Support

The UI supports both English and Arabic languages. Language selection is available in the frontend UI.