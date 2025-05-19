# Medical AI Diagnostics System: Deployment Testing

This document provides instructions for testing the deployment process of the Medical AI Diagnostics System before running the actual deployment scripts.

## Overview

The deployment testing scripts help verify that all prerequisites are met before running the deployment process. This includes checking for required model files, validating configuration files, and ensuring that the environment is properly set up.

## Available Testing Resources

1. **Deployment Testing Scripts**:
   - `test_deployment.ps1` (Windows)
   - `test_deployment.sh` (Linux)

2. **Step-by-Step Deployment Guide**:
   - `DEPLOYMENT_STEPS.md`

3. **Existing Documentation**:
   - `DEPLOYMENT_GUIDE.md`
   - `DEPLOYMENT_README.md`
   - `MONITORING_GUIDE.md`

## Running the Deployment Tests

### Windows

1. Open PowerShell as Administrator
2. Navigate to the project directory
3. Run the test script:

```powershell
.\test_deployment.ps1
```

### Linux

1. Open a terminal
2. Navigate to the project directory
3. Make the test script executable and run it:

```bash
chmod +x test_deployment.sh
./test_deployment.sh
```

## What the Tests Verify

The deployment tests verify:

1. **Model Files**: Checks if all required model files are present in the root directory
2. **Docker Configuration**: Validates that model paths are correctly configured in `docker-compose.yml`
3. **Python Installation**: Confirms Python is installed and the model initialization module is available
4. **Environment Configuration**: Checks if the `.env` file exists and contains required variables
5. **Deployment Scripts**: Verifies that deployment scripts for both Windows and Linux are available
6. **API Healthcheck**: Confirms the API healthcheck script is present

## Deployment Process

After running the tests and resolving any issues, follow these steps to deploy the system:

1. Review the detailed deployment steps in `DEPLOYMENT_STEPS.md`
2. Run the appropriate deployment script for your operating system:
   - Windows: `deploy.ps1`
   - Linux: `deploy.sh`
3. Verify the deployment using the post-deployment verification steps in `DEPLOYMENT_STEPS.md`
4. Monitor the system using the monitoring scripts:
   - Windows: `monitor_system.ps1`
   - Linux: `monitor_system.sh`

## Troubleshooting

If the tests identify missing model files or configuration issues:

1. Ensure all model files are present in the root directory
2. Verify that the `docker-compose.yml` file contains the correct volume mounts for all models
3. Check that Python and required dependencies are installed
4. Create or update the `.env` file with the required environment variables

Refer to `DEPLOYMENT_STEPS.md` for detailed troubleshooting steps.

## Next Steps

After successful deployment:

1. Access the frontend at http://localhost:3000
2. Access the API documentation at http://localhost:8000/docs
3. Monitor system performance using the monitoring scripts and Prometheus metrics

## Additional Resources

For more detailed information about the system, refer to:

- `DEPLOYMENT_GUIDE.md`: Comprehensive deployment guide
- `DEPLOYMENT_README.md`: Basic deployment instructions
- `MONITORING_GUIDE.md`: System monitoring instructions