from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os
from typing import Dict, Any

# Import monitoring
from utils.monitoring import setup_monitoring, ModelMonitoring

# Import model routers
from models.skin_cancer import router as skin_cancer_router
from models.monkeypox import router as monkeypox_router
from models.bone_fracture import router as bone_fracture_router
from models.tumor import router as tumor_router
from models.xray import router as xray_router
from models.lung_colon import router as lung_colon_router
from models.palm_disease import router as palm_disease_router
from models.chatbot import router as chatbot_router

# Import config
from config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("api")

# Initialize FastAPI app
app = FastAPI(
    title="Medical AI Diagnostics API",
    description="API for medical diagnostics using various AI models",
    version="1.0.0",
)

# Setup monitoring
setup_monitoring(app)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check() -> Dict[str, Any]:
    return {"status": "healthy", "version": app.version}

# Include routers for each model
app.include_router(skin_cancer_router, prefix="/api/predict", tags=["Skin Cancer"])
app.include_router(monkeypox_router, prefix="/api/predict", tags=["Monkeypox"])
app.include_router(bone_fracture_router, prefix="/api/predict", tags=["Bone Fracture"])
app.include_router(tumor_router, prefix="/api/predict", tags=["Brain Tumor"])
app.include_router(xray_router, prefix="/api/predict", tags=["X-Ray"])
app.include_router(lung_colon_router, prefix="/api/predict", tags=["Lung Colon Cancer"])
app.include_router(palm_disease_router, prefix="/api/predict", tags=["Palm Disease"])
app.include_router(chatbot_router, prefix="/api/chatbot", tags=["Medical Chatbot"])

# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    

# api/main.py (add imports)
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from passlib.context import CryptContext

from api.utils.security import (
    Token, get_auth_client, create_access_token, 
    USERS, has_permission, JWT_EXPIRATION_MINUTES
)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Add login endpoint
@app.post("/token", response_model=Token, tags=["Authentication"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = USERS.get(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Verify password (in production, use proper password hashing)
    password_matches = pwd_context.verify(form_data.password, user["hashed_password"])
    if not password_matches:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=JWT_EXPIRATION_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "roles": user["roles"]},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}