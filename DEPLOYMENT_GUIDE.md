# Medical AI System Deployment Guide

This guide provides detailed instructions for deploying and maintaining the Medical AI Diagnostics System, including the newly added Palm Disease Detection model.

## System Overview

The system consists of:
- **FastAPI Backend**: Serves multiple AI models via RESTful endpoints
- **React Frontend**: User interface for interacting with the models
- **Docker Containers**: For consistent deployment across environments

## Deployment Steps

### 1. Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd Deployed-DEPI

# Create .env file with required variables
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
```

### 2. Model Initialization

Ensure all models are properly initialized before starting the system:

```bash
# Initialize models and cache
python -m api.core.model_init
```

### 3. Docker Deployment

```bash
# Build and start containers
docker-compose up --build -d

# Check container status
docker ps
```

### 4. Verify Deployment

```bash
# Check backend health
curl http://localhost:8000/health

# Check frontend availability
curl http://localhost:3000
```

## Model-Specific Configuration

### Palm Disease Model (XGBoost)

The Palm Disease model uses XGBoost and requires special handling:

1. Ensure the model file `XGB-Tuned-balancedPalm.pkl` is available in the root directory
2. The model is mounted in the container via docker-compose.yml
3. The API endpoint is available at `/api/predict/palm-disease`
4. The frontend component is accessible at `/models/palm-disease`

## Performance Monitoring

### GPU Utilization

```bash
# Monitor GPU usage
nvidia-smi -l 1
```

### API Performance

- Access Prometheus metrics: http://localhost:8000/metrics
- View performance metrics in the UI: http://localhost:3000/metrics

### Container Health

```bash
# View container logs
docker-compose logs -f backend

# Check container health
docker inspect --format='{{.State.Health.Status}}' deployed-depi-backend-1
```

## Troubleshooting

### Common Issues

1. **Model Loading Failures**
   - Check GPU memory availability
   - Verify model files are correctly mounted
   - Inspect logs: `docker-compose logs -f backend`

2. **Slow Inference Times**
   - Verify GPU acceleration is working: Check for TensorFlow GPU messages in logs
   - Adjust `MODEL_CACHE_SIZE` if models are being unloaded too frequently
   - Consider TensorFlow-TRT optimization for NVIDIA GPUs

3. **Memory Issues**
   - Increase `TF_FORCE_GPU_ALLOW_GROWTH=true` in .env
   - Reduce batch size or model concurrency
   - Monitor memory usage with `docker stats`

## Security Considerations

- All API endpoints validate input data
- JWT authentication is implemented for protected routes
- HTTPS should be enabled in production environments
- Data anonymization is applied to medical images

## Maintenance

### Updating Models

1. Place new model files in the appropriate directory
2. Update model version in `api/config.py`
3. Restart the backend container: `docker-compose restart backend`

### Scaling

For higher load scenarios:

1. Increase container resources in docker-compose.yml
2. Consider deploying multiple backend instances behind a load balancer
3. Implement Redis for distributed model caching

## Bilingual Support

The system supports both English and Arabic languages:

- UI language can be toggled in the frontend
- Error messages are provided in both languages
- Ensure all new components maintain bilingual support