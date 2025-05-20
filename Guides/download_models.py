#!/usr/bin/env python
"""
Model Download Script for Medical AI Diagnostics System

This script helps download model files for the Medical AI Diagnostics System.
It checks for existing models in both old and new locations, downloads missing models
from cloud storage if URLs are provided, and organizes them according to the new
project structure.
"""

import os
import sys
import requests
import shutil
import time
from pathlib import Path
from tqdm import tqdm

# Define paths
BASE_DIR = Path(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = BASE_DIR / 'models'
MODEL_REGISTRY_DIR = BASE_DIR / 'model_registry'

# Model information
MODEL_INFO = {
    'monkeypox': {
        'file': 'DEPI_MONKEYPOX_MODEL.h5',
        'size': '~75MB',
        'source': 'Original monkeypox detection model trained on skin lesion images',
        'download_url': 'https://example.com/models/monkeypox' # Replace with actual URL if available
    },
    'skin_cancer': {
        'file': 'DEPI_SKIN_CANCER_MODEL.h5',
        'size': '~100MB',
        'source': 'Skin cancer classification model trained on dermatological images',
        'download_url': 'https://example.com/models/skin_cancer' # Replace with actual URL if available
    },
    'tumor': {
        'file': 'Tumor.h5',
        'size': '~80MB',
        'source': 'Tumor detection model for medical imaging',
        'download_url': 'https://example.com/models/tumor' # Replace with actual URL if available
    },
    'xray': {
        'file': 'X-ray.h5',
        'size': '~90MB',
        'source': 'X-ray analysis model for detecting abnormalities',
        'download_url': 'https://example.com/models/xray' # Replace with actual URL if available
    },
    'palm_disease': {
        'file': 'XGB-Tuned-balancedPalm.pkl',
        'size': '~50MB',
        'source': 'XGBoost model for palm disease classification',
        'download_url': 'https://example.com/models/palm_disease' # Replace with actual URL if available
    },
    'bone_fracture': {
        'file': 'bone_fracture_model.h5',
        'size': '~85MB',
        'source': 'Bone fracture detection model for X-ray images',
        'download_url': 'https://example.com/models/bone_fracture' # Replace with actual URL if available
    },
    'lung_colon': {
        'file': 'best_weights2 epoch 6 acc 0.79 loss 0.95.keras',
        'size': '~110MB',
        'source': 'Lung and colon cancer detection model',
        'download_url': 'https://example.com/models/lung_colon' # Replace with actual URL if available
    }
}

def download_file(url, destination, model_name):
    """Download a file from a URL to a destination path with progress bar."""
    try:
        print(f"Downloading {model_name} model from {url}...")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Get file size for progress bar
        total_size = int(response.headers.get('content-length', 0))
        
        # Create progress bar
        progress_bar = tqdm(total=total_size, unit='B', unit_scale=True, desc=model_name)
        
        with open(destination, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    progress_bar.update(len(chunk))
        
        progress_bar.close()
        print(f"✅ Successfully downloaded {model_name} model to {destination}")
        return True
    except Exception as e:
        print(f"❌ Error downloading {url}: {e}")
        return False

def check_existing_models():
    """Check for existing model files in both old and new locations."""
    print("\nChecking for existing model files...")
    
    found_models = {}
    
    for model_type, info in MODEL_INFO.items():
        model_file = info['file']
        
        # Check in root directory (old location)
        root_path = BASE_DIR / model_file
        
        # Check in model_registry directory (new location)
        registry_path = MODEL_REGISTRY_DIR / model_type / 'v1' / model_file
        
        # Check in models directory (new location)
        models_path = MODELS_DIR / model_type / model_file
        
        if root_path.exists():
            found_models[model_type] = {'path': root_path, 'location': 'root'}
            print(f"✅ Found {model_type} model in root directory: {root_path}")
        elif registry_path.exists():
            found_models[model_type] = {'path': registry_path, 'location': 'registry'}
            print(f"✅ Found {model_type} model in model registry: {registry_path}")
        elif models_path.exists():
            found_models[model_type] = {'path': models_path, 'location': 'models'}
            print(f"✅ Found {model_type} model in models directory: {models_path}")
        else:
            print(f"❌ {model_type} model not found: {model_file}")
    
    return found_models

def organize_models(found_models):
    """Organize models according to the new project structure."""
    print("\nOrganizing model files...")
    
    for model_type, info in MODEL_INFO.items():
        model_file = info['file']
        model_dir = MODELS_DIR / model_type
        registry_dir = MODEL_REGISTRY_DIR / model_type / 'v1'
        
        # Create directories if they don't exist
        os.makedirs(model_dir, exist_ok=True)
        os.makedirs(registry_dir, exist_ok=True)
        
        # If model was found in an old location, copy it to the new locations
        if model_type in found_models and found_models[model_type]['location'] != 'models':
            source_path = found_models[model_type]['path']
            
            # Copy to models directory
            dest_path = model_dir / model_file
            if not dest_path.exists():
                print(f"Copying {model_type} model to {dest_path}...")
                shutil.copy2(source_path, dest_path)
                print(f"✅ Copied {model_type} model to models directory")
            
            # Copy to model_registry directory
            registry_path = registry_dir / model_file
            if not registry_path.exists():
                print(f"Copying {model_type} model to {registry_path}...")
                shutil.copy2(source_path, registry_path)
                print(f"✅ Copied {model_type} model to model registry")

def download_missing_models(found_models):
    """Download missing model files from provided URLs."""
    print("\nChecking for models to download...")
    
    for model_type, info in MODEL_INFO.items():
        if model_type not in found_models:
            model_file = info['file']
            download_url = info['download_url']
            
            # Skip if URL is a placeholder
            if download_url.startswith('https://example.com'):
                print(f"⚠️ Skipping {model_type} model: URL is a placeholder")
                continue
            
            # Create directories
            model_dir = MODELS_DIR / model_type
            registry_dir = MODEL_REGISTRY_DIR / model_type / 'v1'
            os.makedirs(model_dir, exist_ok=True)
            os.makedirs(registry_dir, exist_ok=True)
            
            # Download to models directory
            model_path = model_dir / model_file
            if download_file(download_url, model_path, model_type):
                # If download successful, copy to registry
                registry_path = registry_dir / model_file
                shutil.copy2(model_path, registry_path)
                print(f"✅ Copied {model_type} model to model registry")

def create_model_info_files():
    """Create information files for each model with download instructions."""
    print("\nCreating model information files...")
    
    for model_type, info in MODEL_INFO.items():
        model_dir = MODELS_DIR / model_type
        os.makedirs(model_dir, exist_ok=True)
        
        # Create README file with download instructions
        readme_path = model_dir / 'README.md'
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(f"""# {model_type.replace('_', ' ').title()} Model

## Model Information
- **Filename**: {info['file']}
- **Size**: {info['size']}
- **Description**: {info['source']}

## Download Instructions

1. Download the model file from: {info['download_url']}
   (If the link is not available, contact your system administrator for the model file)

2. Place the downloaded file in this directory

3. Ensure the filename matches exactly: `{info['file']}`

## Alternative Sources

If you have trained your own model, you can use it instead by:

1. Ensuring it has the same input/output format as the original model
2. Naming it according to the expected filename
3. Placing it in this directory

## Troubleshooting

If you encounter issues with the model:

1. Verify the file is not corrupted during download
2. Check that the model format is compatible with the system
3. Ensure you have the correct version of the model
""")
        
        print(f"✅ Created information file for {model_type} model")

def main():
    """Main function to run the script."""
    print("\n===== Medical AI Diagnostics System Model Download Helper =====\n")
    
    # Check if required directories exist
    if not os.path.exists(MODELS_DIR):
        print(f"❌ Models directory not found at {MODELS_DIR}")
        print("Creating models directory...")
        os.makedirs(MODELS_DIR, exist_ok=True)
    
    if not os.path.exists(MODEL_REGISTRY_DIR):
        print(f"❌ Model registry directory not found at {MODEL_REGISTRY_DIR}")
        print("Creating model registry directory...")
        os.makedirs(MODEL_REGISTRY_DIR, exist_ok=True)
    
    # Check for existing models
    found_models = check_existing_models()
    
    # Ask for confirmation to proceed
    response = input("\nDo you want to organize existing models and download missing ones? (y/n): ")
    if response.lower() != 'y':
        print("Process cancelled.")
        return
    
    # Organize existing models
    organize_models(found_models)
    
    # Download missing models
    download_missing_models(found_models)
    
    # Create model information files
    create_model_info_files()
    
    print("\n✅ Model setup completed successfully!")
    print("\nSummary:")
    
    # Check final status of models
    missing_models = []
    for model_type, info in MODEL_INFO.items():
        model_path = MODELS_DIR / model_type / info['file']
        if model_path.exists():
            print(f"✅ {model_type}: Model is available at {model_path}")
        else:
            print(f"❌ {model_type}: Model is missing")
            missing_models.append(model_type)
    
    if missing_models:
        print("\n⚠️ Some models are still missing. Please:")
        print("1. Check if the download URLs in the script are correct")
        print("2. Manually download the missing models and place them in their respective directories")
        print("3. Run this script again to verify all models are correctly placed")
    else:
        print("\n🎉 All models are available and correctly organized!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nProcess cancelled by user.")
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")