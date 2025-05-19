# Medical AI System Monitoring Guide

This guide provides instructions for monitoring the health and performance of your deployed Medical AI Diagnostics System.

## Monitoring Tools

This repository includes monitoring scripts for both Windows and Linux environments:

### Windows Monitoring

```powershell
.\monitor_system.ps1
```

### Linux Monitoring

```bash
chmod +x monitor_system.sh
./monitor_system.sh
```

## Key Metrics to Monitor

### 1. System Health

- **Container Status**: Ensure all containers are in the "Up" state
- **Backend Health**: The `/health` endpoint should return a 200 status code
- **Frontend Availability**: The frontend should be accessible

### 2. GPU Utilization

For systems with NVIDIA GPUs:

```bash
# One-time check
nvidia-smi

# Continuous monitoring (updates every 1 second)
nvidia-smi -l 1
```

Key metrics to watch:
- **GPU Utilization**: Should increase during inference
- **GPU Memory Usage**: Should not reach capacity
- **Temperature**: Should remain within safe operating range

### 3. API Performance

Access Prometheus metrics at: http://localhost:8000/metrics

Important metrics:
- `http_request_duration_seconds`: Response time for API endpoints
- `model_inference_time`: Time taken for model predictions
- `http_requests_total`: Total number of requests processed

### 4. Model Cache Status

The model cache status endpoint (if implemented) provides information about:
- Current cache size
- Models currently in cache
- Cache hit/miss ratio

## Container Resource Usage

Monitor container CPU, memory, and I/O usage:

```bash
docker stats
```

## Log Monitoring

```bash
# View all logs
docker-compose logs -f

# View only backend logs
docker-compose logs -f backend

# View only frontend logs
docker-compose logs -f frontend
```

## Performance Optimization

If you observe performance issues:

1. **High Inference Times**:
   - Increase `MODEL_CACHE_SIZE` in .env file
   - Consider TensorFlow-TRT optimization for NVIDIA GPUs
   - Check for memory leaks in the model loading code

2. **GPU Memory Issues**:
   - Ensure `TF_FORCE_GPU_ALLOW_GROWTH=true` is set in .env
   - Reduce batch size for inference
   - Consider model quantization

3. **High CPU Usage**:
   - Check for inefficient API endpoints
   - Ensure proper caching is implemented
   - Verify GPU acceleration is working correctly

## Advanced Monitoring

For production environments, consider setting up:

1. **Prometheus + Grafana**: For comprehensive metrics visualization
2. **ELK Stack**: For centralized logging
3. **Alert Manager**: For automated notifications on system issues

## Bilingual Support Verification

To verify bilingual support is working correctly:

1. Access the frontend and toggle between English and Arabic
2. Verify all UI elements update correctly
3. Test error messages in both languages

## Security Monitoring

- Verify all API endpoints require proper authentication
- Check that medical data is properly anonymized
- Ensure HTTPS is enabled in production environments

## Regular Maintenance Tasks

1. **Update Models**: Follow the model update procedure in the deployment guide
2. **Clean Docker**: Periodically remove unused images and volumes
3. **Backup Configuration**: Maintain backups of .env and docker-compose.yml

For more detailed information about the system, refer to the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).