#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Model Downloader Script for DEPI Medical AI Diagnostics System

This script downloads the large model files from an external storage service.
Users should run this script after cloning the repository to download the required model files.

Usage:
    python download_models.py
"""

import os
import sys
import requests
import tqdm

# Configuration - Replace these URLs with your actual storage URLs
MODEL_URLS = {
    "DEPI_MONKEYPOX_MODEL.h5": "https://huggingface.co/mostafaabdo2003ai/Monkeypox-Detection",
    "DEPI_SKIN_CANCER_MODEL.h5": "https://your-storage-service.com/models/DEPI_SKIN_CANCER_MODEL.h5",
    "Model.h5": "https://your-storage-service.com/models/Model.h5",
    "Tumor.h5": "https://your-storage-service.com/models/Tumor.h5",
    "X-ray.h5": "https://your-storage-service.com/models/X-ray.h5",
    "XGB-Tuned-balancedPalm.pkl": "https://your-storage-service.com/models/XGB-Tuned-balancedPalm.pkl",
    "bone_fracture_model.h5": "https://your-storage-service.com/models/bone_fracture_model.h5",
    "best_weights2 epoch 6 acc 0.79 loss 0.95.keras": "https://your-storage-service.com/models/best_weights2_epoch_6_acc_0.79_loss_0.95.keras"
}

def download_file(url, filename):
    """Download a file from a URL to a local file."""
    if os.path.exists(filename):
        print(f"File {filename} already exists. Skipping download.")
        return
    
    try:
        print(f"Downloading {filename}...")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        block_size = 1024  # 1 Kibibyte
        
        with open(filename, 'wb') as file, tqdm.tqdm(
            desc=filename,
            total=total_size,
            unit='iB',
            unit_scale=True,
            unit_divisor=1024,
        ) as bar:
            for data in response.iter_content(block_size):
                size = file.write(data)
                bar.update(size)
                
        print(f"Downloaded {filename} successfully.")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")
        if os.path.exists(filename):
            os.remove(filename)
        return False
    
    return True

def main():
    """Main function to download all model files."""
    print("DEPI Medical AI Diagnostics System - Model Downloader")
    print("==================================================")
    print("This script will download all required model files.")
    print("Please ensure you have a stable internet connection.")
    print()
    
    # Create models directory if it doesn't exist
    os.makedirs("models", exist_ok=True)
    
    success = True
    for filename, url in MODEL_URLS.items():
        if not download_file(url, filename):
            success = False
    
    if success:
        print("\nAll model files downloaded successfully!")
        print("You can now proceed with the deployment steps.")
    else:
        print("\nSome model files could not be downloaded.")
        print("Please check your internet connection and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main()