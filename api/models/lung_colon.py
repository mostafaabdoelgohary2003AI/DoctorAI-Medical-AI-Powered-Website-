import time
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
import numpy as np

# Import schemas
from schemas.request_models import LungColonRequest, PredictionResponse

# Import utilities
from utils.model_loader import model_registry
from utils.image_processing import image_processor

# Import config
from config import settings

# Configure logging
logger = logging.getLogger("lung_colon_model")

# Create router
router = APIRouter()

# Define class labels
CLASS_LABELS = ["Lung Cancer", "Colon Cancer", "Normal"]

@router.post("/lung-colon", response_model=PredictionResponse)
async def predict_lung_colon(request: LungColonRequest) -> Dict[str, Any]:
    """Endpoint for lung and colon cancer prediction"""
    try:
        # Start timing
        start_time = time.time()
        
        # Preprocess image
        preprocessed_image = image_processor.preprocess_for_lung_colon(request.image_data)
        
        # Get model and make prediction
        prediction, inference_time = model_registry.predict(
            settings.LUNG_COLON_MODEL_PATH, 
            preprocessed_image
        )
        
        # Process prediction results
        prediction_array = prediction[0]
        predicted_class_idx = np.argmax(prediction_array)
        confidence = float(prediction_array[predicted_class_idx])
        predicted_class = CLASS_LABELS[predicted_class_idx]
        
        # Calculate total processing time
        total_time = time.time() - start_time
        
        # Log prediction
        logger.info(f"Lung/Colon cancer prediction: {predicted_class} with confidence {confidence:.4f}")
        
        # Return response
        return {
            "prediction": {
                "class": predicted_class,
                "class_index": int(predicted_class_idx),
                "all_probabilities": {CLASS_LABELS[i]: float(prediction_array[i]) for i in range(len(CLASS_LABELS))}
            },
            "confidence": confidence,
            "model_version": settings.MODEL_VERSIONS["lung_colon"],
            "processing_time": total_time
        }
    except Exception as e:
        logger.error(f"Error in lung/colon cancer prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Model metadata endpoint
@router.get("/lung-colon/metadata")
async def get_model_metadata() -> Dict[str, Any]:
    """Get metadata about the lung and colon cancer model"""
    return {
        "model_name": "Lung and Colon Cancer Detection Model",
        "model_version": settings.MODEL_VERSIONS["lung_colon"],
        "model_file": "Model.h5",
        "classes": CLASS_LABELS,
        "input_shape": [224, 224, 3],
        "preprocessing": "Normalization (0-1)"
    }