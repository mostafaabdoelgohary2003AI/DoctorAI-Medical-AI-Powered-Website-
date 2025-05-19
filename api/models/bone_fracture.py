import time
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
import numpy as np

# Import schemas
from schemas.request_models import BoneFractureRequest, PredictionResponse

# Import utilities
from utils.model_loader import model_registry
from utils.image_processing import image_processor

# Import config
from config import settings

# Configure logging
logger = logging.getLogger("bone_fracture_model")

# Create router
router = APIRouter()

# Define class labels
CLASS_LABELS = ["Fractured", "Normal"]

@router.post("/bone-fracture", response_model=PredictionResponse)
async def predict_bone_fracture(request: BoneFractureRequest) -> Dict[str, Any]:
    """Endpoint for bone fracture prediction"""
    try:
        # Start timing
        start_time = time.time()
        
        # Preprocess image
        preprocessed_image = image_processor.preprocess_for_bone_fracture(request.image_data)
        
        # Get model and make prediction
        prediction, inference_time = model_registry.predict(
            settings.BONE_FRACTURE_MODEL_PATH, 
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
        logger.info(f"Bone fracture prediction: {predicted_class} with confidence {confidence:.4f}")
        
        # Return response
        return {
            "prediction": {
                "class": predicted_class,
                "class_index": int(predicted_class_idx),
                "all_probabilities": {CLASS_LABELS[i]: float(prediction_array[i]) for i in range(len(CLASS_LABELS))}
            },
            "confidence": confidence,
            "model_version": settings.MODEL_VERSIONS["bone_fracture"],
            "processing_time": total_time
        }
    except Exception as e:
        logger.error(f"Error in bone fracture prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Model metadata endpoint
@router.get("/bone-fracture/metadata")
async def get_model_metadata() -> Dict[str, Any]:
    """Get metadata about the bone fracture model"""
    return {
        "model_name": "Bone Fracture Detection Model",
        "model_version": settings.MODEL_VERSIONS["bone_fracture"],
        "model_file": "bone_fracture_model.h5",
        "classes": CLASS_LABELS,
        "input_shape": [224, 224, 1],
        "preprocessing": "Grayscale conversion, Normalization (0-1)"
    }