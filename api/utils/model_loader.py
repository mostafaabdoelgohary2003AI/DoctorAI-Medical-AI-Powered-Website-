# api/utils/model_loader.py
import os
import json
import tensorflow as tf
import pickle
import logging
from typing import Dict, Any, Optional, Tuple, OrderedDict
import time
from collections import OrderedDict
from dotenv import load_dotenv
from utils.monitoring import ModelMonitoring

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class LRUCache:
    """LRU Cache implementation for model caching"""
    
    def __init__(self, capacity: int):
        self.cache = OrderedDict()
        self.capacity = capacity
    
    def get(self, key: str):
        if key not in self.cache:
            return None
        # Move to end to show it was recently used
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key: str, value: Any) -> None:
        # If key exists, update and move to end
        if key in self.cache:
            self.cache[key] = value
            self.cache.move_to_end(key)
            return
        
        # If at capacity, remove least recently used item (first item)
        if len(self.cache) >= self.capacity:
            self.cache.popitem(last=False)
            
        # Add new item
        self.cache[key] = value

class ModelRegistry:
    _instance = None
    _models = None
    _metadata = {}
    _model_cache_size = int(os.getenv("MODEL_CACHE_SIZE", "5"))
    _model_timeout_seconds = int(os.getenv("MODEL_TIMEOUT_SECONDS", "30"))
    _model_configs = []
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelRegistry, cls).__new__(cls)
            # Initialize the LRU cache
            cls._models = LRUCache(cls._model_cache_size)
            cls._instance._load_all_models()
        return cls._instance
    
    def _load_all_models(self):
        """Load all models at startup"""
        logger.info("Initializing model registry...")
        
        # Define model paths - adjust based on your Trae IDE structure
        base_path = os.environ.get("MODEL_REGISTRY_PATH", "../model_registry")
        
        self._model_configs = [
            {
                "name": "skin_cancer_model",
                "path": os.path.join(base_path, "skin_cancer/v1/DEPI_SKIN_CANCER_MODEL.h5"),
                "type": "tensorflow",
                "metadata_path": os.path.join(base_path, "skin_cancer/metadata.json")
            },
            {
                "name": "monkeypox_model",
                "path": os.path.join(base_path, "monkeypox/v1/DEPI_MONKEYPOX_MODEL.h5"),
                "type": "tensorflow",
                "metadata_path": os.path.join(base_path, "monkeypox/metadata.json")
            },
            {
                "name": "bone_fracture_model",
                "path": os.path.join(base_path, "bone_fracture/v1/bone_fracture_model.h5"),
                "type": "tensorflow",
                "metadata_path": os.path.join(base_path, "bone_fracture/metadata.json")
            },
            {
                "name": "tumor_model",
                "path": os.path.join(base_path, "tumor/v1/Tumor.h5"),
                "type": "tensorflow",
                "metadata_path": os.path.join(base_path, "tumor/metadata.json")
            },
            {
                "name": "xray_model",
                "path": os.path.join(base_path, "xray/v1/X-ray.h5"),
                "type": "tensorflow",
                "metadata_path": os.path.join(base_path, "xray/metadata.json")
            },
            {
                "name": "lung_colon_model",
                "path": os.path.join(base_path, "lung_colon/v1/Model.h5"),
                "type": "tensorflow",
                "metadata_path": os.path.join(base_path, "lung_colon/metadata.json")
            },
            {
                "name": "palm_disease_model",
                "path": os.path.join(base_path, "palm_disease/v1/XGB-Tuned-balancedPalm.pkl"),
                "type": "pickle",
                "metadata_path": os.path.join(base_path, "palm_disease/metadata.json")
            },
            {
                "name": "medical_chatbot_model",
                "path": os.path.join(base_path, "chatbot/v1/best_weights2 epoch 6 acc 0.79 loss 0.95.keras"),
                "type": "tensorflow",
                "metadata_path": os.path.join(base_path, "chatbot/metadata.json")
            }
        ]
        
        # Load each model
        for config in self._model_configs:
            self._load_model(config)
                
    def _load_model(self, config: Dict[str, str]):
        """Load a single model with timing and error handling"""
        model_name = config["name"]
        model_path = config["path"]
        model_type = config["type"]
        metadata_path = config["metadata_path"]
        
        try:
            start_time = time.time()
            logger.info(f"Loading model: {model_name} from {model_path}")
            
            # Load model based on type
            if model_type == "tensorflow":
                model = tf.keras.models.load_model(model_path)
            elif model_type == "pickle":
                with open(model_path, 'rb') as f:
                    model = pickle.load(f)
            else:
                logger.error(f"Unsupported model type: {model_type}")
                return
            
            # Load metadata if exists
            metadata = {}
            if os.path.exists(metadata_path):
                with open(metadata_path, 'r') as f:
                    metadata = json.load(f)
                    
            # Add warm-up prediction for TensorFlow models to initialize graph
            if model_type == "tensorflow":
                input_shape = model.input_shape[1:]
                dummy_input = tf.ones((1,) + input_shape)
                _ = model.predict(dummy_input)
                
            # Record load time and store model
            load_time = time.time() - start_time
            logger.info(f"Model {model_name} loaded successfully in {load_time:.2f} seconds")
            
            self._models[model_name] = model
            
            # Store metadata with additional info
            metadata.update({
                "load_time": load_time,
                "load_timestamp": time.time(),
                "model_path": model_path
            })
            self._metadata[model_name] = metadata
            
        except Exception as e:
            logger.error(f"Error loading model {model_name}: {str(e)}")
    
    def get_model(self, model_name: str) -> Tuple[Any, Dict[str, Any]]:
        """Get a model by name with LRU caching"""
        # Check if model is in cache
        model = self._models.get(model_name)
        
        if model is not None:
            # Record cache hit in monitoring
            ModelMonitoring.record_cache_hit(model_name)
            logger.debug(f"Cache hit for model: {model_name}")
            return model, self._metadata.get(model_name, {})
        
        # If not in cache, load it
        logger.info(f"Cache miss for model: {model_name}, loading from disk")
        ModelMonitoring.record_cache_miss(model_name)
        
        # Find the model config
        model_config = None
        for config in self._model_configs:
            if config["name"] == model_name:
                model_config = config
                break
        
        if not model_config:
            raise ValueError(f"Model {model_name} not found in registry configuration")
        
        # Load the model
        model = self._load_model(model_config)
        
        # Add to cache
        self._models.put(model_name, model)
        
        return model, self._metadata.get(model_name, {})
    
    def get_metadata(self, model_name: str) -> Dict[str, Any]:
        """Get model metadata"""
        if model_name not in self._metadata:
            logger.error(f"Metadata for model {model_name} not found")
            raise KeyError(f"Metadata for model {model_name} not found")
            
        return self._metadata[model_name]
        
    def predict(self, model_path: str, input_data: Any) -> Tuple[Any, float]:
        """Make a prediction using the specified model"""
        # Get model name from path
        model_name = os.path.basename(model_path)
        
        # Find the model in our registry
        for config in self._model_configs:
            if os.path.basename(config["path"]) == model_name:
                model_name = config["name"]
                break
        
        # Get the model
        start_time = time.time()
        model, _ = self.get_model(model_name)
        
        # Make prediction
        result = model.predict(input_data)
        
        # Calculate inference time
        inference_time = time.time() - start_time
        
        # Log and return
        logger.debug(f"Prediction made with {model_name} in {inference_time:.4f} seconds")
        ModelMonitoring.record_inference_time(model_name, inference_time)
        
        return result, inference_time
    
    def reload_model(self, model_name: str, version: Optional[str] = None) -> Dict[str, Any]:
        """Reload a specific model, optionally from a different version"""
        if model_name not in self._metadata:
            logger.error(f"Cannot reload unknown model: {model_name}")
            raise KeyError(f"Model {model_name} not found for reloading")
            
        base_config = None
        for config in self._model_configs:
            if config["name"] == model_name:
                base_config = config.copy()
                break
                
        if base_config and version:
            # Update path for new version
            base_path = os.environ.get("MODEL_REGISTRY_PATH", "../model_registry")
            model_dir = os.path.dirname(os.path.dirname(base_config["path"]))
            base_config["path"] = os.path.join(model_dir, version, os.path.basename(base_config["path"]))
            
        if base_config:
            self._load_model(base_config)
            return self._metadata[model_name]
        else:
            logger.error(f"Configuration for model {model_name} not found")
            raise KeyError(f"Model {model_name} configuration not found")

# Create singleton instance
model_registry = ModelRegistry()