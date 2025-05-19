#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Model Uploader Script for DEPI Medical AI Diagnostics System

This script helps upload large model files to an external storage service.
Contributors should run this script when they need to update model files.

Usage:
    python upload_models.py
"""

import os
import sys
import argparse
import tqdm

# Import required libraries for cloud storage services
import boto3  # For AWS S3
from botocore.exceptions import NoCredentialsError, ClientError

try:
    from google.cloud import storage  # For Google Cloud Storage
    from google.auth.exceptions import DefaultCredentialsError
    GCS_AVAILABLE = True
except ImportError:
    GCS_AVAILABLE = False

try:
    import dropbox
    from dropbox.exceptions import AuthError, ApiError
    DROPBOX_AVAILABLE = True
except ImportError:
    DROPBOX_AVAILABLE = False

# List of model files to upload
MODEL_FILES = [
    "DEPI_MONKEYPOX_MODEL.h5",
    "DEPI_SKIN_CANCER_MODEL.h5",
    "Model.h5",
    "Tumor.h5",
    "X-ray.h5",
    "XGB-Tuned-balancedPalm.pkl",
    "bone_fracture_model.h5",
    "best_weights2 epoch 6 acc 0.79 loss 0.95.keras"
]

def upload_to_s3(file_path, bucket_name, object_name=None):
    """Upload a file to an S3 bucket

    Args:
        file_path: File to upload
        bucket_name: Bucket to upload to
        object_name: S3 object name. If not specified, file_path is used
    
    Returns:
        True if file was uploaded, else False
    """
    # If S3 object_name was not specified, use file_path
    if object_name is None:
        object_name = os.path.basename(file_path)

    # Upload the file
    try:
        # Create a boto3 client
        s3_client = boto3.client('s3')
        
        print(f"Uploading {file_path} to {bucket_name}/{object_name}...")
        
        # Get file size for progress bar
        file_size = os.path.getsize(file_path)
        
        # Upload with progress bar
        with open(file_path, "rb") as f:
            with tqdm.tqdm(total=file_size, unit='B', unit_scale=True, desc=file_path) as pbar:
                s3_client.upload_fileobj(
                    f, bucket_name, object_name,
                    Callback=lambda bytes_transferred: pbar.update(bytes_transferred),
                )
        
        print(f"Successfully uploaded {file_path} to {bucket_name}/{object_name}")
        return True
    except NoCredentialsError:
        print(f"Error: No AWS credentials found. Please configure your AWS credentials.")
        print("Run 'aws configure' or set environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.")
        return False
    except ClientError as e:
        print(f"AWS Error: {e}")
        return False
    except Exception as e:
        print(f"Error uploading {file_path}: {e}")
        return False

def upload_to_gcs(file_path, bucket_name, object_name=None):
    """Upload a file to a Google Cloud Storage bucket
    
    Args:
        file_path: File to upload
        bucket_name: Bucket to upload to
        object_name: GCS object name. If not specified, file_path is used
    
    Returns:
        True if file was uploaded, else False
    """
    if not GCS_AVAILABLE:
        print("Error: Google Cloud Storage library not installed.")
        print("Install it using: pip install google-cloud-storage")
        return False
        
    # If GCS object_name was not specified, use file_path
    if object_name is None:
        object_name = os.path.basename(file_path)

    # Upload the file
    try:
        # Create a storage client
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(object_name)
        
        print(f"Uploading {file_path} to {bucket_name}/{object_name}...")
        
        # Upload with progress bar
        file_size = os.path.getsize(file_path)
        
        # Define a callback function for progress tracking
        def upload_callback(bytes_transferred):
            pbar.update(bytes_transferred)
        
        with tqdm.tqdm(total=file_size, unit='B', unit_scale=True, desc=file_path) as pbar:
            # Custom upload with progress reporting
            blob.upload_from_filename(file_path)
            pbar.update(file_size)  # Update after completion
        
        print(f"Successfully uploaded {file_path} to {bucket_name}/{object_name}")
        return True
    except DefaultCredentialsError:
        print("Error: No Google Cloud credentials found.")
        print("Please set the GOOGLE_APPLICATION_CREDENTIALS environment variable")
        print("to point to your service account key file.")
        return False
    except Exception as e:
        print(f"Error uploading {file_path}: {e}")
        return False

def upload_to_dropbox(file_path, folder_path):
    """Upload a file to Dropbox
    
    Args:
        file_path: File to upload
        folder_path: Dropbox folder path
    
    Returns:
        True if file was uploaded, else False
    """
    # Get Dropbox access token from environment variable
    access_token = os.environ.get('DROPBOX_ACCESS_TOKEN')
    if not access_token:
        print("Error: No Dropbox access token found.")
        print("Please set the DROPBOX_ACCESS_TOKEN environment variable.")
        return False
    
    try:
        # Create a Dropbox client
        dbx = dropbox.Dropbox(access_token)
        
        # Check if the connection works
        dbx.users_get_current_account()
        
        # Prepare the path in Dropbox
        filename = os.path.basename(file_path)
        dropbox_path = f"/{folder_path}/{filename}" if folder_path else f"/{filename}"
        
        print(f"Uploading {file_path} to Dropbox:{dropbox_path}...")
        
        # Get file size for progress bar
        file_size = os.path.getsize(file_path)
        
        # Upload the file with progress bar
        with open(file_path, "rb") as f:
            file_contents = f.read()
            
        with tqdm.tqdm(total=file_size, unit='B', unit_scale=True, desc=file_path) as pbar:
            # Upload in chunks for large files
            if file_size <= 150 * 1024 * 1024:  # 150 MB max for single upload
                dbx.files_upload(file_contents, dropbox_path, mode=dropbox.files.WriteMode.overwrite)
            else:
                upload_session_start_result = dbx.files_upload_session_start(file_contents[:1024*1024])
                cursor = dropbox.files.UploadSessionCursor(
                    session_id=upload_session_start_result.session_id,
                    offset=len(file_contents[:1024*1024])
                )
                commit = dropbox.files.CommitInfo(path=dropbox_path, mode=dropbox.files.WriteMode.overwrite)
                
                # Upload the remaining file content in chunks
                CHUNK_SIZE = 4 * 1024 * 1024  # 4MB chunks
                pbar.update(1024*1024)
                
                for i in range(1024*1024, len(file_contents), CHUNK_SIZE):
                    if (len(file_contents) - i) <= CHUNK_SIZE:
                        dbx.files_upload_session_finish(
                            file_contents[i:], cursor, commit
                        )
                    else:
                        dbx.files_upload_session_append_v2(
                            file_contents[i:i+CHUNK_SIZE], cursor
                        )
                        cursor.offset += CHUNK_SIZE
                    
                    pbar.update(min(CHUNK_SIZE, len(file_contents) - i))
        
        print(f"Successfully uploaded {file_path} to Dropbox:{dropbox_path}")
        return True
    except AuthError:
        print("Error: Invalid Dropbox access token.")
        return False
    except ApiError as e:
        print(f"Dropbox API Error: {e}")
        return False
    except Exception as e:
        print(f"Error uploading {file_path}: {e}")
        return False

def main():
    """Main function to upload all model files."""
    parser = argparse.ArgumentParser(description='Upload model files to cloud storage.')
    parser.add_argument('--service', choices=['s3', 'gcs', 'dropbox'], default='s3',
                        help='Storage service to use (default: s3)')
    parser.add_argument('--bucket', type=str, default='depi-medical-models',
                        help='Bucket or folder name for storage')
    parser.add_argument('--models-dir', type=str, default='.',
                        help='Directory containing model files (default: current directory)')
    parser.add_argument('--update-download-script', action='store_true',
                        help='Update download_models.py with new URLs after upload')
    args = parser.parse_args()
    
    print("DEPI Medical AI Diagnostics System - Model Uploader")
    print("==================================================")
    print(f"Using storage service: {args.service}")
    print(f"Target bucket/folder: {args.bucket}")
    print()
    
    # Check if model files exist
    models_dir = args.models_dir
    model_paths = [os.path.join(models_dir, f) for f in MODEL_FILES]
    missing_files = [f for f in model_paths if not os.path.exists(f)]
    
    if missing_files:
        print("The following model files are missing:")
        for f in missing_files:
            print(f"  - {f}")
        print("\nPlease ensure all model files are present before uploading.")
        sys.exit(1)
        
    # Check for required credentials based on selected service
    if args.service == 's3':
        if not (os.environ.get('AWS_ACCESS_KEY_ID') and os.environ.get('AWS_SECRET_ACCESS_KEY')):
            try:
                # Check if credentials are configured via AWS CLI
                boto3.Session().get_credentials()
            except NoCredentialsError:
                print("Error: AWS credentials not found.")
                print("Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables")
                print("or configure credentials using the AWS CLI ('aws configure').")
                sys.exit(1)
    elif args.service == 'gcs':
        if not GCS_AVAILABLE:
            print("Error: Google Cloud Storage library not installed.")
            print("Install it using: pip install google-cloud-storage")
            sys.exit(1)
        if not os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'):
            print("Warning: GOOGLE_APPLICATION_CREDENTIALS environment variable not set.")
            print("If you encounter authentication errors, please set this variable")
            print("to point to your service account key file.")
    elif args.service == 'dropbox':
        if not DROPBOX_AVAILABLE:
            print("Error: Dropbox library not installed.")
            print("Install it using: pip install dropbox")
            sys.exit(1)
        if not os.environ.get('DROPBOX_ACCESS_TOKEN'):
            print("Error: DROPBOX_ACCESS_TOKEN environment variable not set.")
            print("Please set this variable with your Dropbox access token.")
            sys.exit(1)
    
    # Upload files based on selected service
    success = True
    uploaded_files = []
    
    for file_path in model_paths:
        if args.service == 's3':
            if upload_to_s3(file_path, args.bucket):
                uploaded_files.append((os.path.basename(file_path), f"https://{args.bucket}.s3.amazonaws.com/{os.path.basename(file_path)}"))
            else:
                success = False
        elif args.service == 'gcs':
            if upload_to_gcs(file_path, args.bucket):
                uploaded_files.append((os.path.basename(file_path), f"https://storage.googleapis.com/{args.bucket}/{os.path.basename(file_path)}"))
            else:
                success = False
        elif args.service == 'dropbox':
            if not DROPBOX_AVAILABLE:
                print("Error: Dropbox library not installed.")
                print("Install it using: pip install dropbox")
                success = False
                break
            if not upload_to_dropbox(file_path, args.bucket):
                success = False
    
    if success:
        print("\nAll model files uploaded successfully!")
        
        # Update download_models.py if requested
        if args.update_download_script and uploaded_files:
            try:
                update_download_script(uploaded_files, args.service)
                print("\nUpdated download_models.py with new URLs.")
            except Exception as e:
                print(f"\nFailed to update download_models.py: {e}")
                print("You'll need to manually update the URLs.")
        
        print("\nNext steps:")
        if not args.update_download_script:
            print("1. Update the URLs in download_models.py with the new storage locations")
        print("2. Commit your changes using Git LFS")
    else:
        print("\nSome model files could not be uploaded.")
        print("Please check your credentials and try again.")
        sys.exit(1)

def update_download_script(uploaded_files, service):
    """Update the download_models.py script with new URLs"""
    download_script = "download_models.py"
    
    if not os.path.exists(download_script):
        print(f"Warning: {download_script} not found. Cannot update URLs.")
        return
    
    with open(download_script, 'r') as f:
        content = f.read()
    
    # Find the MODEL_URLS dictionary in the script
    import re
    model_urls_pattern = r'MODEL_URLS\s*=\s*\{[^\}]*\}'
    model_urls_match = re.search(model_urls_pattern, content, re.DOTALL)
    
    if not model_urls_match:
        print(f"Warning: MODEL_URLS dictionary not found in {download_script}")
        return
    
    # Create new MODEL_URLS dictionary
    new_model_urls = "MODEL_URLS = {"
    for filename, url in uploaded_files:
        new_model_urls += f'\n    "{filename}": "{url}",'
    new_model_urls += "\n}"
    
    # Replace the old dictionary with the new one
    updated_content = content.replace(model_urls_match.group(0), new_model_urls)
    
    # Write the updated content back to the file
    with open(download_script, 'w') as f:
        f.write(updated_content)
    
    print(f"Updated {download_script} with new URLs for {service} storage.")

if __name__ == "__main__":
    main()