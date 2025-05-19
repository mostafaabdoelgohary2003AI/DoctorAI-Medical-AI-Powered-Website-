# api/utils/security.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader
from pydantic import BaseModel
from typing import Optional, List, Dict
import time
import jwt
from datetime import datetime, timedelta

# API key authentication
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

# OAuth2 with JWT tokens
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

# JWT configuration
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_MINUTES = int(os.getenv("JWT_EXPIRATION_MINUTES", 30))

# Rate limiting configuration
RATE_LIMIT_DURATION = int(os.getenv("RATE_LIMIT_DURATION", 60))  # seconds
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", 100))  # requests per duration
rate_limit_store: Dict[str, List[float]] = {}

# CORS Configuration
ALLOW_ORIGINS = os.getenv("ALLOW_ORIGINS", "http://localhost:3000,http://localhost:8000")
BACKEND_CORS_ORIGINS: List[str] = ALLOW_ORIGINS.split(",")

# Simple API key store (use database in production)
API_KEYS = {
    "dev-key": {"client": "development", "permissions": ["read", "predict"]},
    "admin-key": {"client": "admin", "permissions": ["read", "predict", "admin"]},
}

# User store for JWT authentication (use database in production)
USERS = {
    "admin": {
        "username": "admin",
        "email": "admin@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
        "disabled": False,
        "roles": ["admin"]
    },
    "user": {
        "username": "user",
        "email": "user@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
        "disabled": False,
        "roles": ["user"]
    }
}

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    roles: List[str] = []

# Rate limiting
def check_rate_limit(client_id: str):
    """Check if client has exceeded rate limit"""
    now = time.time()
    
    if client_id not in rate_limit_store:
        rate_limit_store[client_id] = []
        
    # Remove timestamps older than the window
    rate_limit_store[client_id] = [
        ts for ts in rate_limit_store[client_id]
        if now - ts < RATE_LIMIT_DURATION
    ]
    
    # Check if client has reached limit
    if len(rate_limit_store[client_id]) >= RATE_LIMIT_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded"
        )
        
    # Add current request timestamp
    rate_limit_store[client_id].append(now)

# API Key validation
async def get_api_key(api_key: str = Depends(api_key_header)):
    if not api_key:
        return None
        
    if api_key not in API_KEYS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key"
        )
        
    # Check rate limit
    check_rate_limit(API_KEYS[api_key]["client"])
        
    return API_KEYS[api_key]

# JWT Token validation
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=JWT_EXPIRATION_MINUTES)
    )
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    if not token:
        return None
        
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        
        if username is None:
            return None
            
        token_data = TokenData(username=username, roles=payload.get("roles", []))
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user = USERS.get(token_data.username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if user.get("disabled", False):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Check rate limit
    check_rate_limit(f"user:{token_data.username}")
        
    return user

# Combined authentication - checks either API key or JWT
async def get_auth_client(
    api_client = Depends(get_api_key),
    user = Depends(get_current_user)
):
    if api_client:
        return {
            "client_type": "api",
            "client_id": api_client["client"],
            "permissions": api_client["permissions"]
        }
    elif user:
        return {
            "client_type": "user",
            "client_id": user["username"],
            "permissions": user["roles"]
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Permission checking
def has_permission(required_permission: str):
    def check_permission(auth_client = Depends(get_auth_client)):
        if required_permission not in auth_client["permissions"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: {required_permission} required"
            )
        return auth_client
    return check_permission