import os
from pydantic_settings import BaseSettings
from typing import Dict, List, Optional

class Settings(BaseSettings):
    # API Configuration
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Medical AI Diagnostics API"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # CORS Configuration
    ALLOW_ORIGINS = os.getenv("ALLOW_ORIGINS", "http://localhost:3000,http://localhost:8000")
    BACKEND_CORS_ORIGINS: List[str] = ALLOW_ORIGINS.split(",")
    
    # Model Paths
    MODEL_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Individual model paths
    SKIN_CANCER_MODEL_PATH: str = os.path.join(MODEL_DIR, "DEPI_SKIN_CANCER_MODEL.h5")
    MONKEYPOX_MODEL_PATH: str = os.path.join(MODEL_DIR, "DEPI_MONKEYPOX_MODEL.h5")
    BONE_FRACTURE_MODEL_PATH: str = os.path.join(MODEL_DIR, "bone_fracture_model.h5")
    TUMOR_MODEL_PATH: str = os.path.join(MODEL_DIR, "Tumor.h5")
    XRAY_MODEL_PATH: str = os.path.join(MODEL_DIR, "X-ray.h5")
    LUNG_COLON_MODEL_PATH: str = os.path.join(MODEL_DIR, "Model.h5")
    PALM_DISEASE_MODEL_PATH: str = os.path.join(MODEL_DIR, "XGB-Tuned-balancedPalm.pkl")
    CHATBOT_MODEL_PATH: str = os.path.join(MODEL_DIR, "best_weights2 epoch 6 acc 0.79 loss 0.95.keras")
    
    # Model metadata
    MODEL_VERSIONS: Dict[str, str] = {
        "skin_cancer": "1.0.0",
        "monkeypox": "1.0.0",
        "bone_fracture": "1.0.0",
        "tumor": "1.0.0",
        "xray": "1.0.0",
        "lung_colon": "1.0.0",
        "palm_disease": "1.0.0",
        "chatbot": "1.0.0"
    }
    
    # Logging configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Model caching configuration
    MODEL_CACHE_SIZE: int = int(os.getenv("MODEL_CACHE_SIZE", "5"))
    MODEL_TIMEOUT_SECONDS: int = int(os.getenv("MODEL_TIMEOUT_SECONDS", "30"))
    
    class Config:
        case_sensitive = True

# Create settings instance
settings = Settings()