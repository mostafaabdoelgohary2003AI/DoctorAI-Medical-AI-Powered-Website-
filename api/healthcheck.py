#!/usr/bin/env python
# api/healthcheck.py

import requests
import sys
import time
import logging
from typing import Dict, Any, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("healthcheck")

# API endpoint to check
HEALTH_ENDPOINT = "http://localhost:8000/health"
MAX_RETRIES = 5
RETRY_DELAY = 2  # seconds

def check_api_health() -> bool:
    """Check if the API is healthy by calling the health endpoint"""
    for attempt in range(MAX_RETRIES):
        try:
            logger.info(f"Healthcheck attempt {attempt + 1}/{MAX_RETRIES}")
            response = requests.get(HEALTH_ENDPOINT, timeout=10)
            
            if response.status_code == 200:
                health_data = response.json()
                logger.info(f"API is healthy: {health_data}")
                return True
            else:
                logger.warning(f"API returned non-200 status code: {response.status_code}")
        except requests.RequestException as e:
            logger.warning(f"Failed to connect to API: {e}")
        
        # Wait before retrying
        if attempt < MAX_RETRIES - 1:
            logger.info(f"Retrying in {RETRY_DELAY} seconds...")
            time.sleep(RETRY_DELAY)
    
    logger.error("API healthcheck failed after maximum retries")
    return False

def check_model_endpoints() -> Dict[str, bool]:
    """Check if model metadata endpoints are accessible"""
    model_endpoints = [
        "/api/predict/skin-cancer/metadata",
        "/api/predict/brain-tumor/metadata",
        "/api/predict/bone-fracture/metadata",
        "/api/predict/lung-colon/metadata"
    ]
    
    results = {}
    base_url = "http://localhost:8000"
    
    for endpoint in model_endpoints:
        try:
            url = f"{base_url}{endpoint}"
            logger.info(f"Checking model endpoint: {url}")
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                logger.info(f"Model endpoint {endpoint} is accessible")
                results[endpoint] = True
            else:
                logger.warning(f"Model endpoint {endpoint} returned status code: {response.status_code}")
                results[endpoint] = False
        except requests.RequestException as e:
            logger.warning(f"Failed to connect to model endpoint {endpoint}: {e}")
            results[endpoint] = False
    
    return results

if __name__ == "__main__":
    # Check API health
    api_healthy = check_api_health()
    
    if api_healthy:
        # Check model endpoints
        model_results = check_model_endpoints()
        all_models_healthy = all(model_results.values())
        
        if all_models_healthy:
            logger.info("All model endpoints are accessible")
            sys.exit(0)  # Success
        else:
            logger.error("Some model endpoints are not accessible")
            for endpoint, status in model_results.items():
                if not status:
                    logger.error(f"Failed endpoint: {endpoint}")
            sys.exit(1)  # Failure
    else:
        sys.exit(1)  # Failure