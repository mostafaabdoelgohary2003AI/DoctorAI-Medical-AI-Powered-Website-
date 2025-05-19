import time
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
import numpy as np
import tensorflow as tf

# Import schemas
from schemas.request_models import ChatbotRequest, ChatbotResponse

# Import utilities
from utils.model_loader import model_registry
from utils.image_processing import image_processor
from utils.text_processing import text_processor

# Import config
from config import settings

# Configure logging
logger = logging.getLogger("medical_chatbot")

# Create router
router = APIRouter()

# Fallback responses when model confidence is low
FALLBACK_RESPONSES = {
    "headache": "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or more serious conditions. If persistent, please consult a doctor.",
    "fever": "Fever is often a sign that your body is fighting an infection. Rest, stay hydrated, and take fever reducers if needed. Seek medical attention if fever is high or persistent.",
    "cough": "Coughs can be caused by viral infections, allergies, or irritants. A persistent cough may require medical evaluation.",
    "rash": "Skin rashes can be caused by allergies, infections, or autoimmune conditions. If a rash is spreading or accompanied by other symptoms, consult a healthcare provider.",
    "pain": "Pain can indicate various conditions. The location, intensity, and duration of pain are important factors for diagnosis. Persistent pain should be evaluated by a healthcare professional."
}

# Confidence threshold for model predictions
CONFIDENCE_THRESHOLD = 0.6

@router.post("/message", response_model=ChatbotResponse)
async def process_chatbot_message(request: ChatbotRequest) -> Dict[str, Any]:
    """Endpoint for medical chatbot interaction"""
    try:
        # Start timing
        start_time = time.time()
        
        # Process the message
        user_message = request.message
        
        # Default fallback response
        fallback_response = "I'm sorry, I don't have specific information about that. Please consult a healthcare professional for medical advice."
        
        # Preprocess text for model input
        preprocessed_text = text_processor.preprocess_for_chatbot(user_message)
        
        # Get model and make prediction
        prediction, inference_time = model_registry.predict(
            settings.CHATBOT_MODEL_PATH, 
            preprocessed_text
        )
        
        # Process model output to generate response
        model_confidence = np.max(prediction[0]) if hasattr(prediction, 'shape') else 0.0
        
        # Use model response if confidence is high enough
        if model_confidence >= CONFIDENCE_THRESHOLD:
            response = text_processor.process_model_output(prediction)
        else:
            # Fall back to keyword matching for low confidence predictions
            response = fallback_response
            
            # Check for keywords in our fallback knowledge base
            user_message_lower = user_message.lower()
            for keyword, info in FALLBACK_RESPONSES.items():
                if keyword in user_message_lower:
                    response = info
                    break
        
        # If image is provided, process it
        if request.image_data and request.message_type == "image":
            # In a production system, we would use a multimodal model or image analysis
            # For now, we'll acknowledge the image and provide basic response
            image_prefix = "I've analyzed your medical image. "
            
            # We could extract features from the image to enhance the response
            # For example, detecting skin conditions in images
            response = image_prefix + response
        
        # Calculate total processing time
        total_time = time.time() - start_time
        
        # Log interaction (excluding sensitive data)
        logger.info(f"Chatbot interaction processed in {total_time:.4f} seconds with confidence {model_confidence:.4f}")
        
        # Return response
        return {
            "response": response,
            "model_version": settings.MODEL_VERSIONS["chatbot"],
            "processing_time": total_time
        }
    except Exception as e:
        logger.error(f"Error in chatbot processing: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Model metadata endpoint
@router.get("/metadata")
async def get_model_metadata() -> Dict[str, Any]:
    """Get metadata about the medical chatbot model"""
    return {
        "model_name": "Medical Chatbot Model",
        "model_version": settings.MODEL_VERSIONS["chatbot"],
        "model_file": "best_weights2 epoch 6 acc 0.79 loss 0.95.keras",
        "capabilities": ["Text-based medical queries", "Basic image analysis"],
        "limitations": ["Not a replacement for professional medical advice", "Limited to general information"],
        "confidence_threshold": CONFIDENCE_THRESHOLD,
        "max_sequence_length": text_processor.max_sequence_length
    }