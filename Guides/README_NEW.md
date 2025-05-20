# Medical AI Diagnostics System (DEPI)

A comprehensive medical diagnostics system powered by AI models for detecting various medical conditions including skin cancer, brain tumors, bone fractures, palm diseases, and more.

## Current Project Structure Analysis

After analyzing the current project structure, I've found:

### Backend (FastAPI)
- Located in `/api` directory
- Properly structured with models, schemas, utils, and core components
- Uses TensorFlow and XGBoost for various medical diagnostic models
- Implements model caching with LRU implementation
- Includes monitoring with Prometheus
- Has JWT authentication

### Frontend (React)
- Located in `/react-app` directory
- Built with React 18, TypeScript, Redux Toolkit
- Uses Vite as build tool
- Implements code splitting for better performance
- Has error boundaries and loading states

### Model Files
- Various model files (.h5, .keras, .pkl) referenced in docker-compose.yml
- Model metadata stored in `/model_registry` directory

## Reorganization Plan

To create a cleaner structure, I recommend reorganizing the project as follows:

### 1. Create Client Directory

Move the React frontend to a dedicated client directory:

```
/client
├── public/           # Static assets
├── src/              # React source code
│   ├── assets/       # Frontend assets
│   ├── components/   # React components
│   ├── layouts/      # Page layouts
│   ├── pages/        # Application pages
│   ├── services/     # API service clients
│   └── store/        # State management
├── package.json      # Dependencies
└── vite.config.ts    # Vite configuration
```

### 2. Create Server Directory

Move the FastAPI backend to a dedicated server directory:

```
/server
├── core/             # Core functionality
│   └── model_init.py # Model initialization
├── model_registry/   # Model metadata
├── models/           # Model implementation files
├── schemas/          # Data validation schemas
├── tests/            # API tests
├── utils/            # Utility functions
├── main.py           # FastAPI application
└── requirements.txt  # Python dependencies
```

### 3. Create Models Directory

Organize model files in a dedicated directory:

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

## Model Loading Implementation

The system uses a ModelRegistry class with LRU caching to efficiently load and manage models:

1. Models are loaded using TensorFlow or pickle depending on the file type
2. The LRU cache ensures only the most recently used models stay in memory
3. Model metadata is stored in JSON files in the model_registry directory
4. The `model_init.py` script pre-loads models into the cache

## Deployment Plan

### Option 1: Unified Deployment with Docker

1. **Build and deploy using Docker Compose**:
   ```bash
   docker-compose up -d
   ```
   - Backend will be available at http://localhost:8000
   - Frontend will be available at http://localhost:3000

2. **Monitor the application**:
   ```bash
   ./monitor_system.sh  # or monitor_system.ps1 on Windows
   ```

### Option 2: Split Deployment

1. **Frontend Deployment on Vercel**:
   - Push the client directory to a GitHub repository
   - Connect the repository to Vercel
   - Configure build settings:
     - Build command: `npm run build`
     - Output directory: `dist`
   - Set environment variables for API URL

2. **Backend Deployment on Render**:
   - Push the server directory to a GitHub repository
   - Create a new Web Service on Render
   - Select the repository and configure:
     - Runtime: Python 3.9
     - Build command: `pip install -r requirements.txt`
     - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables from .env file
   - Configure a volume for model storage

3. **Model Storage**:
   - Store models in a persistent volume on Render
   - Alternatively, use a cloud storage service like AWS S3 or Google Cloud Storage
   - Update model_loader.py to load models from the appropriate location

## Running the Project Locally

### Prerequisites

- Python 3.9+
- Node.js 16+
- Docker and Docker Compose (optional)

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Initialize models:
   ```bash
   python -m core.model_init
   ```

4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application at http://localhost:5173

## Testing

1. Run backend tests:
   ```bash
   cd server
   pytest tests/
   ```

2. Test API endpoints:
   ```bash
   python tests/test_api.py
   ```

## Monitoring

The system includes Prometheus metrics for monitoring:

- Model inference time
- API response time
- Memory usage
- Cache hit/miss ratio

Access metrics at http://localhost:8000/metrics

## Security Considerations

- JWT authentication is implemented for API endpoints
- CORS is configured to restrict access to specific origins in production
- Input validation is performed using Pydantic schemas
- Secure practices for handling medical data are implemented

## Next Steps

1. Complete the reorganization of the project structure
2. Update Docker configuration files to reflect the new structure
3. Implement CI/CD pipeline for automated testing and deployment
4. Enhance monitoring with alerting capabilities
5. Implement user management and role-based access control