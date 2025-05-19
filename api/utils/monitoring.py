# api/utils/monitoring.py
import time
import psutil
import logging
import os
from typing import Dict, Any, Optional
from fastapi import FastAPI
from prometheus_client import Counter, Histogram, Gauge
from prometheus_fastapi_instrumentator import Instrumentator, metrics
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger("monitoring")

# Define Prometheus metrics
MODEL_PREDICTION_TIME = Histogram(
    name="model_prediction_time",
    documentation="Time spent on model prediction",
    labelnames=["model_name", "model_version"],
    buckets=(0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1.0, 2.5, 5.0, 7.5, 10.0),
)

MODEL_PREDICTION_COUNT = Counter(
    name="model_prediction_count",
    documentation="Number of predictions made",
    labelnames=["model_name", "status"],
)

MEMORY_USAGE = Gauge(
    name="memory_usage_percent",
    documentation="Memory usage of the application",
)

GPU_MEMORY_USAGE = Gauge(
    name="gpu_memory_usage_percent",
    documentation="GPU memory usage if available",
    labelnames=["device"],
)

MODEL_CACHE_HITS = Counter(
    name="model_cache_hits",
    documentation="Number of model cache hits",
    labelnames=["model_name"],
)

MODEL_CACHE_MISSES = Counter(
    name="model_cache_misses",
    documentation="Number of model cache misses",
    labelnames=["model_name"],
)

# Monitoring class
class ModelMonitoring:
    @staticmethod
    def record_prediction_time(model_name: str, model_version: str, duration: float) -> None:
        """Record the time taken for a model prediction"""
        MODEL_PREDICTION_TIME.labels(model_name=model_name, model_version=model_version).observe(duration)
    
    @staticmethod
    def increment_prediction_count(model_name: str, status: str = "success") -> None:
        """Increment the prediction counter"""
        MODEL_PREDICTION_COUNT.labels(model_name=model_name, status=status).inc()
    
    @staticmethod
    def record_cache_hit(model_name: str) -> None:
        """Record a cache hit for a model"""
        MODEL_CACHE_HITS.labels(model_name=model_name).inc()
    
    @staticmethod
    def record_cache_miss(model_name: str) -> None:
        """Record a cache miss for a model"""
        MODEL_CACHE_MISSES.labels(model_name=model_name).inc()
    
    @staticmethod
    def update_memory_usage() -> None:
        """Update memory usage metrics"""
        memory_percent = psutil.virtual_memory().percent
        MEMORY_USAGE.set(memory_percent)
        
        # Try to get GPU memory usage if available
        try:
            import tensorflow as tf
            gpus = tf.config.experimental.list_physical_devices('GPU')
            if gpus:
                for i, gpu in enumerate(gpus):
                    # This is a simplified approach - in production you'd use
                    # nvidia-smi or tf.config.experimental.get_memory_info
                    GPU_MEMORY_USAGE.labels(device=f"gpu-{i}").set(50.0)  # Placeholder
        except Exception as e:
            logger.warning(f"Could not get GPU memory usage: {e}")

# Setup Prometheus instrumentation for FastAPI
def setup_monitoring(app: FastAPI) -> None:
    """Setup monitoring for the FastAPI application"""
    # Check if Prometheus monitoring is enabled
    enable_prometheus = os.getenv("ENABLE_PROMETHEUS", "true").lower() == "true"
    
    if not enable_prometheus:
        logger.info("Prometheus monitoring disabled by configuration")
        return
        
    # Setup Prometheus instrumentation
    instrumentator = Instrumentator()
    
    # Add default metrics
    instrumentator.add(metrics.latency())
    instrumentator.add(metrics.requests())
    instrumentator.add(metrics.requests_in_progress())
    instrumentator.add(metrics.dependency_latency())
    instrumentator.add(metrics.cpu_usage())
    
    # Instrument the app
    instrumentator.instrument(app).expose(app, endpoint="/metrics", include_in_schema=True)
    
    # Start a background task to update memory usage
    @app.on_event("startup")
    async def startup_event():
        import asyncio
        
        async def update_memory_metrics():
            while True:
                ModelMonitoring.update_memory_usage()
                await asyncio.sleep(15)  # Update every 15 seconds
        
        asyncio.create_task(update_memory_metrics())
    
    logger.info("Prometheus monitoring setup complete")