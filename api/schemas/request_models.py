from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum

class ImageUpload(BaseModel):
    """Base model for image upload requests"""
    image_data: str = Field(..., description="Base64 encoded image data")
    
class SkinCancerRequest(ImageUpload):
    """Request model for skin cancer prediction"""
    pass

class MonkeypoxRequest(ImageUpload):
    """Request model for monkeypox prediction"""
    pass

class BoneFractureRequest(ImageUpload):
    """Request model for bone fracture prediction"""
    pass

class TumorRequest(ImageUpload):
    """Request model for brain tumor prediction"""
    pass

class XRayRequest(ImageUpload):
    """Request model for X-Ray analysis"""
    pass

class LungColonRequest(ImageUpload):
    """Request model for lung and colon cancer prediction"""
    pass

class PalmDiseaseRequest(ImageUpload):
    """Request model for palm disease prediction"""
    additional_features: Optional[Dict[str, Any]] = Field(None, description="Additional features for XGBoost model")

class ChatbotMessageType(str, Enum):
    TEXT = "text"
    IMAGE = "image"

class ChatbotRequest(BaseModel):
    """Request model for medical chatbot"""
    message: str = Field(..., description="User message")
    message_type: ChatbotMessageType = Field(default=ChatbotMessageType.TEXT, description="Type of message")
    image_data: Optional[str] = Field(None, description="Base64 encoded image data if message type is image")
    conversation_history: Optional[List[Dict[str, Any]]] = Field(default=[], description="Previous conversation history")

class PredictionResponse(BaseModel):
    """Base response model for predictions"""
    prediction: Any
    confidence: float
    model_version: str
    processing_time: float

class ChatbotResponse(BaseModel):
    """Response model for chatbot"""
    response: str
    model_version: str
    processing_time: float