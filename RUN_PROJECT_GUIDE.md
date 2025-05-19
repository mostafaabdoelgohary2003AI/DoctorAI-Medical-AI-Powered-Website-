# DEPI Medical AI Project: Complete Setup Guide

This guide provides step-by-step instructions for setting up and running the DEPI Medical AI Diagnostics System from start to finish.

## Project Overview

The DEPI Medical AI system consists of:
- **FastAPI Backend**: Serves multiple AI models via RESTful endpoints
- **React Frontend**: User interface for interacting with the models
- **AI Models**: Various medical diagnostic models (skin cancer, monkeypox, bone fracture, etc.)

## Step 1: Clone the Repository

```bash
# Clone the repository (if you haven't already)
git clone <repository-url>
cd Deployed-DEPI
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
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
```

## Step 3: Download AI Models

The project requires several large model files that are stored externally. Use the provided script to download them:

```bash
# Run the model download script
python download_models.py
```

This script will download the following model files:
- DEPI_MONKEYPOX_MODEL.h5
- DEPI_SKIN_CANCER_MODEL.h5
- Model.h5
- Tumor.h5
- X-ray.h5
- XGB-Tuned-balancedPalm.pkl
- bone_fracture_model.h5
- best_weights2 epoch 6 acc 0.79 loss 0.95.keras

> **Note**: If the download URLs in the script are placeholders, you'll need to update them with the actual URLs where your model files are stored. See the MODEL_UPLOAD_README.md for instructions on uploading models to cloud storage services.

## Step 4: Install Backend Dependencies

```bash
# Navigate to the API directory
cd api

# Install Python dependencies
pip install -r requirements.txt

# Return to the root directory
cd ..
```

## Step 5: Install Frontend Dependencies

```bash
# Navigate to the project directory
cd project

# Install Node.js dependencies
npm install

# Return to the root directory
cd ..
```

## Step 6: Start the Backend Server

You have two options for running the backend:

### Option A: Run directly with Python

```bash
# Navigate to the API directory
cd api

# Start the FastAPI server with uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Return to the root directory when done
cd ..
```

### Option B: Run with Docker

```bash
# Build and start the backend container
docker-compose up --build -d backend
```

## Step 7: Start the Frontend Development Server

```bash
# Navigate to the project directory
cd project

# Start the development server
npm run dev
```

The frontend will be available at http://localhost:5173 (or the port shown in the terminal).

## Step 8: Verify the Deployment

1. **Check Backend Health**:
   - Open a browser and navigate to http://localhost:8000/health
   - You should see a JSON response indicating the API is running

2. **Access the Frontend**:
   - Open a browser and navigate to http://localhost:5173 (or the port shown when starting the frontend)
   - You should see the DEPI Medical AI interface

## Step 9: Using the System

Once both the backend and frontend are running:

1. Navigate to the frontend URL in your browser
2. Select the desired diagnostic model from the interface
3. Upload an image for analysis
4. View the diagnostic results

## Troubleshooting

### Model Download Issues

If you encounter issues downloading the models:

- Check your internet connection
- Verify that the URLs in `download_models.py` are correct
- Try downloading the models manually and placing them in the root directory

### Backend Connection Issues

If the frontend cannot connect to the backend:

- Ensure the backend server is running
- Check that CORS is properly configured
- Verify the API URL in the frontend configuration

### Model Loading Errors

If models fail to load:

- Verify that all model files were downloaded correctly
- Check the backend logs for specific error messages
- Ensure you have sufficient RAM/GPU memory for the models

## Monitoring

To monitor the system's performance:

```bash
# View backend logs
docker-compose logs -f backend  # If using Docker

# Monitor GPU usage (if using GPU)
nvidia-smi -l 1

# Access Prometheus metrics
http://localhost:8000/metrics
```

## Production Deployment

For production deployment, additional steps are recommended:

1. Update the CORS settings in `main.py` to restrict access to specific origins
2. Set up proper authentication and SSL/TLS
3. Configure a reverse proxy (Nginx, Apache) in front of the API
4. Build the frontend for production: `cd project && npm run build`

Refer to DEPLOYMENT_GUIDE.md for more detailed production deployment instructions.