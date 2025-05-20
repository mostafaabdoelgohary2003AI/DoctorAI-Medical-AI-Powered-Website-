# DEPI Medical AI Model Upload Guide

This guide explains how to upload the large model files used by the DEPI Medical AI Diagnostics System to cloud storage services.

## Prerequisites

Before uploading models, ensure you have:

1. All model files in your local directory
2. Installed the required dependencies:
   ```
   pip install tqdm boto3 google-cloud-storage dropbox
   ```
3. Configured credentials for your chosen cloud service

## Cloud Service Setup

### AWS S3

To use AWS S3, you need to set up your credentials in one of these ways:

1. **Environment variables**:
   ```
   # Windows
   set AWS_ACCESS_KEY_ID=your_access_key
   set AWS_SECRET_ACCESS_KEY=your_secret_key
   
   # Linux/macOS
   export AWS_ACCESS_KEY_ID=your_access_key
   export AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

2. **AWS CLI configuration**:
   ```
   aws configure
   ```
   Then enter your access key, secret key, default region, and output format.

### Google Cloud Storage

To use Google Cloud Storage:

1. Install the Google Cloud SDK
2. Create a service account and download the JSON key file
3. Set the environment variable to point to your key file:
   ```
   # Windows
   set GOOGLE_APPLICATION_CREDENTIALS=path\to\your-key-file.json
   
   # Linux/macOS
   export GOOGLE_APPLICATION_CREDENTIALS=path/to/your-key-file.json
   ```

### Dropbox

To use Dropbox:

1. Create an app in the [Dropbox Developer Console](https://www.dropbox.com/developers/apps)
2. Generate an access token
3. Set the environment variable:
   ```
   # Windows
   set DROPBOX_ACCESS_TOKEN=your_access_token
   
   # Linux/macOS
   export DROPBOX_ACCESS_TOKEN=your_access_token
   ```

## Usage

### Basic Usage

To upload all model files to the default S3 bucket:

```
python upload_models.py
```

### Specifying a Storage Service

Choose between AWS S3, Google Cloud Storage, or Dropbox:

```
python upload_models.py --service s3
python upload_models.py --service gcs
python upload_models.py --service dropbox
```

### Specifying a Bucket or Folder

Set the destination bucket or folder name:

```
python upload_models.py --bucket your-bucket-name
```

### Specifying the Models Directory

If your model files are in a different directory:

```
python upload_models.py --models-dir ./models
```

### Automatically Update Download Script

To automatically update the download_models.py script with the new URLs:

```
python upload_models.py --update-download-script
```

## Complete Example

```
python upload_models.py --service gcs --bucket depi-medical-models --models-dir ./models --update-download-script
```

## Troubleshooting

### Authentication Issues

- **AWS S3**: Ensure your credentials are correctly set up using `aws configure` or environment variables.
- **Google Cloud Storage**: Verify your service account key file is correctly referenced by the GOOGLE_APPLICATION_CREDENTIALS environment variable.
- **Dropbox**: Check that your access token is valid and has the correct permissions.

### Missing Dependencies

If you encounter errors about missing libraries, install them using pip:

```
pip install boto3  # For AWS S3
pip install google-cloud-storage  # For Google Cloud Storage
pip install dropbox  # For Dropbox
```

### Permission Errors

Ensure your cloud service account has write permissions to the specified bucket or folder.

## After Uploading

After successfully uploading the models:

1. If you didn't use the `--update-download-script` option, manually update the URLs in download_models.py
2. Commit your changes using Git LFS
3. Inform users to run download_models.py to get the updated models