#!/bin/bash

echo -e "\033[1;36m=== Medical AI System Monitoring ===\033[0m"
echo -e "\033[1;36mThis script helps monitor the health and performance of your deployed Medical AI system.\033[0m"
echo ""

# Check if Docker is running
if docker ps &>/dev/null; then
    echo -e "\033[1;32m✓ Docker is running.\033[0m"
else
    echo -e "\033[1;31m✗ Docker is not running. Please start Docker service.\033[0m"
    exit 1
fi

# Check container status
echo -e "\n\033[1;33mChecking container status...\033[0m"
docker-compose ps

# Define URLs
BACKEND_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:3000"

# Check backend health
echo -e "\n\033[1;33mChecking backend health...\033[0m"
backend_health=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/health)
if [ "$backend_health" == "200" ]; then
    echo -e "\033[1;32m✓ Backend health check passed.\033[0m"
else
    echo -e "\033[1;31m✗ Backend health check failed. Status code: $backend_health\033[0m"
fi

# Check frontend availability
echo -e "\n\033[1;33mChecking frontend availability...\033[0m"
frontend_health=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL)
if [ "$frontend_health" == "200" ]; then
    echo -e "\033[1;32m✓ Frontend check passed.\033[0m"
else
    echo -e "\033[1;31m✗ Frontend check failed. Status code: $frontend_health\033[0m"
fi

# Check GPU utilization if available
echo -e "\n\033[1;33mChecking GPU utilization...\033[0m"
if command -v nvidia-smi &> /dev/null; then
    nvidia-smi
    echo -e "\n\033[1;36mFor continuous GPU monitoring, run: nvidia-smi -l 1\033[0m"
else
    echo -e "\033[1;33mNo NVIDIA GPU detected or nvidia-smi not available.\033[0m"
fi

# Check container resource usage
echo -e "\n\033[1;33mChecking container resource usage...\033[0m"
docker stats --no-stream

# Check Prometheus metrics
echo -e "\n\033[1;33mChecking Prometheus metrics...\033[0m"
metrics_response=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/metrics)
if [ "$metrics_response" == "200" ]; then
    echo -e "\033[1;32m✓ Prometheus metrics available.\033[0m"
    echo -e "  \033[1;36mView metrics at: $BACKEND_URL/metrics\033[0m"
    
    # Get metrics content
    metrics_content=$(curl -s $BACKEND_URL/metrics)
    
    echo -e "\n\033[1;33mKey Performance Metrics:\033[0m"
    
    # Extract HTTP request duration metrics if they exist
    if echo "$metrics_content" | grep -q "http_request_duration_seconds"; then
        echo -e "  \033[1;32mHTTP Request Duration metrics available\033[0m"
    fi
    
    # Extract model inference time metrics if they exist
    if echo "$metrics_content" | grep -q "model_inference_time"; then
        echo -e "  \033[1;32mModel Inference Time metrics available\033[0m"
    fi
else
    echo -e "\033[1;31m✗ Prometheus metrics check failed. Status code: $metrics_response\033[0m"
    echo -e "  \033[1;33mCheck if ENABLE_PROMETHEUS=true in your .env file\033[0m"
fi

# Check model cache status
echo -e "\n\033[1;33mChecking model cache status...\033[0m"
cache_response=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/api/system/cache-status)
if [ "$cache_response" == "200" ]; then
    echo -e "\033[1;32m✓ Model cache status available.\033[0m"
    cache_data=$(curl -s $BACKEND_URL/api/system/cache-status)
    cache_size=$(echo $cache_data | grep -o '"cache_size":[^,}]*' | cut -d ':' -f2)
    cached_models=$(echo $cache_data | grep -o '"cached_models":\[[^]]*\]' | cut -d ':' -f2)
    echo -e "  \033[1;36mCache Size: $cache_size\033[0m"
    echo -e "  \033[1;36mCached Models: $cached_models\033[0m"
else
    echo -e "\033[1;31m✗ Model cache status check failed. Status code: $cache_response\033[0m"
    echo -e "  \033[1;33mThe cache status endpoint may not be implemented.\033[0m"
fi

# Check logs for errors
echo -e "\n\033[1;33mChecking for errors in logs...\033[0m"
docker-compose logs --tail=50 backend | grep -E "ERROR|Exception|Failed"

echo -e "\n\033[1;36m=== Monitoring Complete ===\033[0m"
echo -e "\033[1;36mFor detailed logs, run: docker-compose logs -f\033[0m"
echo -e "\033[1;36mFor API documentation, visit: $BACKEND_URL/docs\033[0m"
echo -e "\033[1;36mFor continuous monitoring, consider setting up Prometheus with Grafana\033[0m"