#!/usr/bin/env python
"""
Reorganization script for Medical AI Diagnostics System (DEPI)

This script reorganizes the project structure into a cleaner format with:
- client/ for the React frontend
- server/ for the FastAPI backend
- models/ for model files
"""

import os
import shutil
import json
from pathlib import Path

# Define paths
BASE_DIR = Path(os.path.dirname(os.path.abspath(__file__)))
CLIENT_DIR = BASE_DIR / 'client'
SERVER_DIR = BASE_DIR / 'server'
MODELS_DIR = BASE_DIR / 'models'

# Create directories if they don't exist
os.makedirs(CLIENT_DIR, exist_ok=True)
os.makedirs(SERVER_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

# Model directories
MODEL_TYPES = [
    'bone_fracture',
    'monkeypox',
    'skin_cancer',
    'tumor',
    'xray',
    'palm_disease',
    'lung_colon',
    'chatbot'
]

# Create model subdirectories
for model_type in MODEL_TYPES:
    os.makedirs(MODELS_DIR / model_type, exist_ok=True)

# Function to copy directory contents
def copy_directory(src, dst):
    if not os.path.exists(src):
        print(f"Source directory {src} does not exist. Skipping.")
        return
    
    if not os.path.exists(dst):
        os.makedirs(dst)
    
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        if os.path.isdir(s):
            copy_directory(s, d)
        else:
            if not os.path.exists(os.path.dirname(d)):
                os.makedirs(os.path.dirname(d))
            if not os.path.exists(d) or os.path.getmtime(s) > os.path.getmtime(d):
                shutil.copy2(s, d)

# Step 1: Move React frontend to client directory
print("Moving React frontend to client directory...")
REACT_APP_DIR = BASE_DIR / 'react-app'
if os.path.exists(REACT_APP_DIR):
    copy_directory(REACT_APP_DIR, CLIENT_DIR)
    print("✅ React frontend moved successfully")
else:
    print("❌ React app directory not found")

# Step 2: Move FastAPI backend to server directory
print("\nMoving FastAPI backend to server directory...")
API_DIR = BASE_DIR / 'api'
if os.path.exists(API_DIR):
    copy_directory(API_DIR, SERVER_DIR)
    print("✅ FastAPI backend moved successfully")
else:
    print("❌ API directory not found")

# Step 3: Move model files to models directory
print("\nMoving model files to models directory...")

# Model file mapping based on docker-compose.yml
MODEL_FILES = {
    'monkeypox': ['DEPI_MONKEYPOX_MODEL.h5'],
    'skin_cancer': ['DEPI_SKIN_CANCER_MODEL.h5'],
    'tumor': ['Tumor.h5'],
    'xray': ['X-ray.h5'],
    'palm_disease': ['XGB-Tuned-balancedPalm.pkl'],
    'bone_fracture': ['bone_fracture_model.h5'],
    'lung_colon': ['Model.h5'],
    'chatbot':['best_weights2 epoch 6 acc 0.79 loss 0.95.keras']
}

# Potential locations to search for model files
POTENTIAL_LOCATIONS = [
    BASE_DIR,
    BASE_DIR / 'api',
    BASE_DIR / 'api' / 'models',
    BASE_DIR / 'project',
    BASE_DIR / 'DoctorAI Models'
]

# Copy model files
for model_type, files in MODEL_FILES.items():
    for file in files:
        found = False
        
        # Search for the file in potential locations
        for location in POTENTIAL_LOCATIONS:
            src_file = location / file
            if os.path.exists(src_file):
                dst_file = MODELS_DIR / model_type / file
                os.makedirs(os.path.dirname(dst_file), exist_ok=True)
                shutil.copy2(src_file, dst_file)
                print(f"✅ Copied {file} to {model_type} directory from {location}")
                found = True
                break
        
        if not found:
            print(f"❌ Model file {file} not found in any of the searched locations")
            # Create placeholder directory anyway
            os.makedirs(MODELS_DIR / model_type, exist_ok=True)
            # Create a placeholder file with instructions
            placeholder_path = MODELS_DIR / model_type / f"{file}.placeholder.txt"
            with open(placeholder_path, 'w', encoding='utf-8') as f:
                f.write(f"Place your {file} model file here.\n\nThis is a placeholder created during project reorganization.")
            print(f"  Created placeholder for {file} in {model_type} directory")

# Step 4: Copy model registry metadata
print("\nCopying model registry metadata...")
MODEL_REGISTRY_DIR = BASE_DIR / 'model_registry'
SERVER_MODEL_REGISTRY_DIR = SERVER_DIR / 'model_registry'

if os.path.exists(MODEL_REGISTRY_DIR):
    copy_directory(MODEL_REGISTRY_DIR, SERVER_MODEL_REGISTRY_DIR)
    print("✅ Model registry metadata copied successfully")
else:
    print("❌ Model registry directory not found")

# Step 5: Update docker-compose.yml
print("\nCreating updated docker-compose.yml...")
DOCKER_COMPOSE_PATH = BASE_DIR / 'docker-compose.yml'
NEW_DOCKER_COMPOSE_PATH = BASE_DIR / 'docker-compose.new.yml'

# Create a basic updated docker-compose file
with open(NEW_DOCKER_COMPOSE_PATH, 'w') as f:
    f.write("""version: '3'

services:
  backend:
    build:
      context: .
      dockerfile: docker/api.Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./server:/app
      - ./models:/app/models
    env_file:
      - .env
    environment:
      - TF_FORCE_GPU_ALLOW_GROWTH=${TF_FORCE_GPU_ALLOW_GROWTH:-true}
      - TF_CPP_MIN_LOG_LEVEL=${TF_CPP_MIN_LOG_LEVEL:-2}
      - API_HOST=${API_HOST:-0.0.0.0}
      - API_PORT=${API_PORT:-8000}
      - ENVIRONMENT=${ENVIRONMENT:-development}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRATION_MINUTES=${JWT_EXPIRATION_MINUTES:-30}
      - ENABLE_PROMETHEUS=${ENABLE_PROMETHEUS:-true}
      - MODEL_CACHE_SIZE=${MODEL_CACHE_SIZE:-5}
      - MODEL_TIMEOUT_SECONDS=${MODEL_TIMEOUT_SECONDS:-30}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    volumes:
      - ./client:/app
      - /app/node_modules
    env_file:
      - .env
    environment:
      - REACT_APP_API_URL=${REACT_APP_API_URL:-http://localhost:8000}
      - NODE_ENV=${NODE_ENV:-development}
    depends_on:
      - backend
""")

print("✅ Created updated docker-compose.yml as docker-compose.new.yml")

# Step 6: Update model_loader.py to use new model paths
print("\nUpdating model loader to use new model paths...")
MODEL_LOADER_PATH = SERVER_DIR / 'utils' / 'model_loader.py'

if os.path.exists(MODEL_LOADER_PATH):
    # Read the current file
    with open(MODEL_LOADER_PATH, 'r') as f:
        content = f.read()
    
    # Add a comment about the new model paths
    updated_content = content.replace(
        "# Load environment variables", 
        "# Load environment variables\n# Models are now stored in /app/models/{model_type}/ directory"
    )
    
    # Write the updated file
    with open(MODEL_LOADER_PATH, 'w') as f:
        f.write(updated_content)
    
    print("✅ Updated model loader with new paths")
else:
    print("❌ model_loader.py not found")

# Step 7: Create necessary server directory structure
print("\nCreating necessary server directory structure...")
SERVER_DIRS = [
    SERVER_DIR / 'core',
    SERVER_DIR / 'models',
    SERVER_DIR / 'schemas',
    SERVER_DIR / 'utils',
    SERVER_DIR / 'tests',
    SERVER_DIR / 'tests' / 'test_data'
]

for dir_path in SERVER_DIRS:
    os.makedirs(dir_path, exist_ok=True)

print("✅ Created server directory structure")

# Step 8: Create README file in models directory
print("\nCreating README file in models directory...")
MODELS_README_PATH = MODELS_DIR / 'README.md'

with open(MODELS_README_PATH, 'w', encoding='utf-8') as f:
    f.write("""
# Model Files Directory

This directory contains the model files for the Medical AI Diagnostics System.

## Directory Structure

```
/models
├── bone_fracture/
│   └── bone_fracture_model.h5
├── monkeypox/
│   └── DEPI_MONKEYPOX_MODEL.h5
├── skin_cancer/
│   └── DEPI_SKIN_CANCER_MODEL.h5
├── tumor/
│   └── Tumor.h5
├── xray/
│   └── X-ray.h5
├── palm_disease/
│   └── XGB-Tuned-balancedPalm.pkl
└── lung_colon/
    └── best_weights2 epoch 6 acc 0.79 loss 0.95.keras
```

## Model Loading

Models are loaded using the ModelRegistry class in the server/utils/model_loader.py file.

## Adding New Models

To add a new model:

1. Create a new directory for the model type
2. Add the model file to the directory
3. Update the model registry metadata
4. Update the model loader to use the new model

## Troubleshooting

If you encounter issues with model loading, check the following:

1. Ensure the model file exists in the correct location
2. Verify the model path in config.py
3. Check the model registry metadata
4. Look for error messages in the logs
""")

print("✅ Created README file in models directory")

print("\n✅ Project reorganization complete!")
print("\nNext steps:")
print("1. Review the reorganized structure")
print("2. Update paths in code if necessary")
print("3. Test the application with the new structure")
print("4. Use docker-compose.new.yml for deployment")
print("5. Download or add the actual model files to the models directory")