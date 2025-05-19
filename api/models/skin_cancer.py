import time
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
import numpy as np

# Import monitoring
from utils.monitoring import ModelMonitoring

# Import schemas
from schemas.request_models import SkinCancerRequest, PredictionResponse

# Import utilities
from utils.model_loader import model_registry
from utils.image_processing import image_processor

# Import config
from config import settings

# Configure logging
logger = logging.getLogger("skin_cancer_model")

# Create router
router = APIRouter()

# Define class labels
CLASS_LABELS = [
    "Actinic Keratosis",
    "Basal Cell Carcinoma",
    "Dermatofibroma",
    "Melanoma",
    "Nevus",
    "Pigmented Benign Keratosis",
    "Seborrheic Keratosis",
    "Squamous Cell Carcinoma",
    "Vascular Lesion"
]

@router.post("/skin-cancer", response_model=PredictionResponse)
async def predict_skin_cancer(request: SkinCancerRequest) -> Dict[str, Any]:
    """Endpoint for skin cancer prediction"""
    try:
        # Start timing
        start_time = time.time()
        
        # Preprocess image
        preprocessed_image = image_processor.preprocess_for_skin_cancer(request.image_data)
        
        # Get model and make prediction
        prediction, inference_time = model_registry.predict(
            settings.SKIN_CANCER_MODEL_PATH, 
            preprocessed_image
        )
        
        # Record metrics
        ModelMonitoring.record_prediction_time("skin_cancer", settings.MODEL_VERSIONS["skin_cancer"], inference_time)
        ModelMonitoring.increment_prediction_count("skin_cancer")
        
        # Process prediction results
        prediction_array = prediction[0]
        predicted_class_idx = np.argmax(prediction_array)
        confidence = float(prediction_array[predicted_class_idx])
        predicted_class = CLASS_LABELS[predicted_class_idx]
        
        # Calculate total processing time
        total_time = time.time() - start_time
        
        # Log prediction
        logger.info(f"Skin cancer prediction: {predicted_class} with confidence {confidence:.4f}")
        
        # Return response
        return {
            "prediction": {
                "class": predicted_class,
                "class_index": int(predicted_class_idx),
                "all_probabilities": {CLASS_LABELS[i]: float(prediction_array[i]) for i in range(len(CLASS_LABELS))}
            },
            "confidence": confidence,
            "model_version": settings.MODEL_VERSIONS["skin_cancer"],
            "processing_time": total_time
        }
    except Exception as e:
        logger.error(f"Error in skin cancer prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Model metadata endpoint
@router.get("/skin-cancer/metadata")
async def get_model_metadata() -> Dict[str, Any]:
    """Get metadata about the skin cancer model"""
    return {
        "model_name": "Skin Cancer Classification Model",
        "model_version": settings.MODEL_VERSIONS["skin_cancer"],
        "model_file": "DEPI_SKIN_CANCER_MODEL.h5",
        "classes": CLASS_LABELS,
        "input_shape": [224, 224, 3],
        "preprocessing": "Normalization (0-1)"
    }