import time
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
import numpy as np

# Import schemas
from schemas.request_models import PalmDiseaseRequest, PredictionResponse

# Import utilities
from utils.model_loader import model_registry
from utils.image_processing import image_processor

# Import config
from config import settings

# Configure logging
logger = logging.getLogger("palm_disease_model")

# Create router
router = APIRouter()

# Define class labels
CLASS_LABELS = ["Healthy", "Diseased"]

@router.post("/palm-disease", response_model=PredictionResponse)
async def predict_palm_disease(request: PalmDiseaseRequest) -> Dict[str, Any]:
    """Endpoint for palm disease prediction using XGBoost model"""
    try:
        # Start timing
        start_time = time.time()
        
        # Preprocess image and additional features
        features = image_processor.preprocess_for_palm_disease(
            request.image_data,
            request.additional_features or {}
        )
        
        # Get model and make prediction
        prediction, inference_time = model_registry.predict(
            settings.PALM_DISEASE_MODEL_PATH, 
            features,
            model_type="pickle"
        )
        
        # Process prediction results (XGBoost returns different format than TensorFlow)
        if hasattr(prediction, 'shape') and len(prediction.shape) > 1:
            # For probability predictions
            predicted_class_idx = np.argmax(prediction[0])
            confidence = float(prediction[0][predicted_class_idx])
        else:
            # For class predictions
            predicted_class_idx = int(prediction[0])
            confidence = 0.95  # XGBoost might not provide confidence directly
            
        predicted_class = CLASS_LABELS[predicted_class_idx]
        
        # Calculate total processing time
        total_time = time.time() - start_time
        
        # Log prediction
        logger.info(f"Palm disease prediction: {predicted_class} with confidence {confidence:.4f}")
        
        # Return response
        return {
            "prediction": {
                "class": predicted_class,
                "class_index": int(predicted_class_idx),
                "features_used": list(features.keys()) if isinstance(features, dict) else []
            },
            "confidence": confidence,
            "model_version": settings.MODEL_VERSIONS["palm_disease"],
            "processing_time": total_time
        }
    except Exception as e:
        logger.error(f"Error in palm disease prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Model metadata endpoint
@router.get("/palm-disease/metadata")
async def get_model_metadata() -> Dict[str, Any]:
    """Get metadata about the palm disease model"""
    return {
        "model_name": "Palm Disease Prediction Model (XGBoost)",
        "model_version": settings.MODEL_VERSIONS["palm_disease"],
        "model_file": "XGB-Tuned-balancedPalm.pkl",
        "classes": CLASS_LABELS,
        "model_type": "XGBoost",
        "preprocessing": "Image features extraction + additional features"
    }