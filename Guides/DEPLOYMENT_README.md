# Medical AI System Deployment Instructions

This document provides instructions for deploying the Medical AI Diagnostics System using the provided deployment scripts.

## Prerequisites

- Docker and Docker Compose installed
- Python 3.7+ installed
- NVIDIA GPU with CUDA support (optional, for GPU acceleration)
- NVIDIA drivers and nvidia-docker (if using GPU)

## Deployment Options

This repository includes deployment scripts for both Windows and Linux environments. Choose the appropriate script based on your operating system.

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

## What the Deployment Scripts Do

The deployment scripts automate the following steps:

1. **Environment Setup**: Checks for prerequisites and creates a `.env` file with necessary configuration
2. **GPU Detection**: Checks for NVIDIA GPU and enables GPU support if available
3. **Model Initialization**: Initializes AI models and caches
4. **Palm Disease Model Check**: Verifies the XGBoost Palm Disease model is available
5. **Container Deployment**: Builds and starts Docker containers
6. **Health Verification**: Performs comprehensive health checks on backend and frontend
7. **API Testing**: Runs API healthcheck to ensure all endpoints are functioning
8. **GPU Monitoring**: Displays GPU utilization if GPU is available

## Accessing the System

After successful deployment, you can access the system at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Monitoring Metrics**: http://localhost:8000/metrics

## Troubleshooting

If you encounter issues during deployment:

1. Check Docker container logs:
   ```
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

2. Verify GPU support (if applicable):
   ```
   nvidia-smi
   ```

3. Check model initialization logs:
   ```
   python -m api.core.model_init --verbose
   ```

4. Ensure all model files are in the correct locations, especially the Palm Disease model file `XGB-Tuned-balancedPalm.pkl`

## Stopping the System

To stop the system and shut down all containers:

```
docker-compose down
```

For more detailed information about the system, refer to the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).