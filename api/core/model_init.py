# api/core/model_init.py
import os
import logging
import tensorflow as tf
import numpy as np
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import config
from config import settings

# Import model registry
from utils.model_loader import model_registry
from utils.monitoring import ModelMonitoring

# Configure logging
logger = logging.getLogger("model_initialization")

# Configure TensorFlow to use memory growth
def configure_gpu():
    """Configure GPU settings for optimal performance"""
    try:
        gpus = tf.config.experimental.list_physical_devices('GPU')
        if gpus:
            logger.info(f"Found {len(gpus)} GPU(s)")
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)
                logger.info(f"Set memory growth for {gpu}")
        else:
            logger.warning("No GPU found, using CPU for inference")
    except Exception as e:
        logger.error(f"Error configuring GPU: {e}")

# Initialize all models
def initialize_models():
    """Pre-load all models into memory cache based on configuration"""
    logger.info("Starting model initialization...")
    
    # Configure GPU
    configure_gpu()
    
    # Get cache size from environment
    model_cache_size = int(os.getenv("MODEL_CACHE_SIZE", "5"))
    logger.info(f"Model cache size set to: {model_cache_size}")
    
    # List of model paths to initialize
    model_paths = [
        settings.SKIN_CANCER_MODEL_PATH,
        settings.MONKEYPOX_MODEL_PATH,
        settings.BONE_FRACTURE_MODEL_PATH,
        settings.TUMOR_MODEL_PATH,
        settings.XRAY_MODEL_PATH,
        settings.LUNG_COLON_MODEL_PATH,
        settings.PALM_DISEASE_MODEL_PATH,
        settings.CHATBOT_MODEL_PATH
    ]
    
    # Initialize each model
    for model_path in model_paths:
        try:
            model_name = os.path.basename(model_path)
            logger.info(f"Initializing model: {model_name}")
            
            # Create a dummy input for the model
            if model_path.endswith('.pkl'):
                # For XGBoost models
                dummy_input = np.random.random((1, 10))  # Adjust features as needed
            else:
                # For TensorFlow models
                dummy_input = np.random.random((1, 224, 224, 3))  # Standard image input
            
            # Warm up the model cache
            _, inference_time = model_registry.predict(model_path, dummy_input)
            
            logger.info(f"Model {model_name} initialized in {inference_time:.4f} seconds")
        except Exception as e:
            logger.error(f"Error initializing model {model_path}: {e}")
    
    logger.info("Model initialization complete")

# Main function to run when this module is executed directly
if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )
    initialize_models()