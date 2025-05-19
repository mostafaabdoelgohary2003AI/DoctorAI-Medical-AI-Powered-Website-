# Medical AI Diagnostics System

A comprehensive medical diagnostics system powered by AI models for detecting various medical conditions including skin cancer, brain tumors, bone fractures, palm diseases, and more.

> **IMPORTANT**: This repository contains large model files (3.91 GB total). Please follow the [Git LFS Setup Instructions](#git-lfs-setup) below for proper handling.

## System Architecture

- **Backend**: FastAPI with TensorFlow/XGBoost models
- **Frontend**: React with TypeScript and Redux Toolkit
- **Deployment**: Docker containers with health monitoring

## Features

- Multiple medical diagnostic models including:
  - Monkeypox Detection
  - X-Ray Pneumonia Detection
  - Skin Cancer Classification
  - Bone Fracture Detection
  - Brain Tumor Detection
  - Lung & Colon Cancer Detection
  - Palm Disease Detection (XGBoost model)
- Real-time performance monitoring with Prometheus
- Secure API with JWT authentication
- Bilingual support (English/Arabic)
- GPU acceleration (when available)
- Model versioning and caching with LRU implementation

## Deployment Instructions

### Prerequisites

- Docker and Docker Compose
- NVIDIA GPU with CUDA support (optional but recommended)
- 8GB+ RAM

### Quick Start

1. Clone the repository
2. Navigate to the project directory
3. Run the following command to start all services:

```bash
docker-compose up -d
```

4. Access the frontend at http://localhost:3000
5. Access the API documentation at http://localhost:8000/docs

### Monitoring

The system includes Prometheus metrics for monitoring:

- Model prediction times
- Memory usage
- GPU utilization (if available)
- Cache hit/miss rates

Access metrics at http://localhost:8000/metrics

### Model Initialization

Models are automatically initialized on startup. To manually initialize models:

```bash
python -m api.core.model_init
```

### Security

The API uses JWT token authentication. To obtain a token:

```bash
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user&password=password"
```

Use the token in subsequent requests:

```bash
curl -X GET "http://localhost:8000/api/predict/skin-cancer/metadata" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Development

### Backend Development

```bash
cd api
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Frontend Development

```bash
cd project
npm install
npm run dev
```

## Git LFS Setup

This repository uses Git Large File Storage (Git LFS) to handle model files that exceed GitHub's file size limit (100MB).

### For Users: Downloading the Repository

1. **Install Git LFS**

   ```bash
   # Windows
   winget install GitHub.GitLFS
   
   # macOS
   brew install git-lfs
   
   # Linux
   sudo apt-get install git-lfs
   ```

2. **Enable Git LFS**

   ```bash
   git lfs install
   ```

3. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/depi-medical-ai.git
   cd depi-medical-ai
   ```

4. **Download Model Files**

   Run the provided script to download all model files:

   ```bash
   python download_models.py
   ```

### For Contributors: Updating Model Files

If you need to update the model files:

1. Make sure Git LFS is installed and enabled
2. Place your updated model files in the root directory
3. Commit as usual - Git LFS will handle the large files automatically

For more detailed instructions, see [GIT_LFS_SETUP.md](./GIT_LFS_SETUP.md).

## Troubleshooting

### Common Issues

1. **Models not loading**: Check if model files are correctly mounted in the Docker container
2. **GPU not detected**: Ensure NVIDIA drivers and CUDA are properly installed
3. **Slow prediction times**: Check the monitoring metrics for bottlenecks

### Logs

View Docker logs:

```bash
docker-compose logs -f backend
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.