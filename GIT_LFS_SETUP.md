# Git LFS Setup for DEPI Medical AI Diagnostics System

## Overview

This project contains large model files (`.h5`, `.keras`, and `.pkl`) that exceed GitHub's file size limit of 100MB. To handle these files properly, we use Git Large File Storage (Git LFS) which allows you to version large files while storing the actual content on a remote server.

## Setup Instructions

### 1. Install Git LFS

Before cloning the repository, install Git LFS:

**Windows:**
```
winget install GitHub.GitLFS
```

**macOS:**
```
brew install git-lfs
```

**Linux:**
```
sudo apt-get install git-lfs
```

### 2. Enable Git LFS

After installation, enable Git LFS:

```
git lfs install
```

### 3. Clone the Repository

```
git clone https://github.com/your-username/depi-medical-ai.git
cd depi-medical-ai
```

### 4. Download Model Files

The large model files are not directly included in the repository. Run the provided script to download them:

```
python download_models.py
```

## For Contributors

If you're contributing to this project and need to update the model files:

1. Make sure Git LFS is installed and enabled
2. Place your updated model files in the root directory
3. Commit as usual - Git LFS will handle the large files automatically

```
git add .
git commit -m "Update model files"
git push
```

## Troubleshooting

If you encounter issues with Git LFS:

1. Verify Git LFS is installed: `git lfs version`
2. Check LFS status: `git lfs status`
3. For download issues, try manually downloading the models using the `download_models.py` script

## Note for Repository Size

Even with Git LFS, be aware that the total size of the repository including all models is approximately 3.91 GB. Ensure you have sufficient disk space before cloning.