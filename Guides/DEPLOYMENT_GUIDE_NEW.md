# Medical AI Diagnostics System: Deployment Guide

This guide provides detailed instructions for reorganizing and deploying the Medical AI Diagnostics System (DEPI) after the project structure has been updated.

## Project Reorganization

### Automated Reorganization

Use the provided reorganization script to automatically restructure the project:

```bash
python reorganize_project.py
```

This script will:
1. Move the React frontend to the `/client` directory
2. Move the FastAPI backend to the `/server` directory
3. Organize model files in the `/models` directory
4. Update Docker configuration files

### Manual Verification

After running the script, verify the following:

1. Check that all model files are correctly placed in their respective directories under `/models`
2. Ensure all backend code is properly moved to the `/server` directory
3. Confirm that the React frontend is correctly moved to the `/client` directory
4. Review the updated `docker-compose.new.yml` file

## Local Development Setup

### Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
pip install -r requirements.txt

# Initialize models
python -m core.model_init

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Docker Deployment

### Using Docker Compose

```bash
# Rename the new docker-compose file
mv docker-compose.new.yml docker-compose.yml

# Build and start containers
docker-compose up --build -d

# Check container status
docker-compose ps

# View logs
docker-compose logs -f
```

### Monitoring

Monitor the application using the provided scripts:

```bash
# On Linux/macOS
./monitor_system.sh

# On Windows
.\monitor_system.ps1
```

## Cloud Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend)

#### Frontend Deployment on Vercel

1. Push the client directory to a GitHub repository
2. Connect the repository to Vercel
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Set environment variables:
   - `REACT_APP_API_URL`: URL of your backend API

#### Backend Deployment on Render

1. Push the server directory to a GitHub repository
2. Create a new Web Service on Render
3. Select the repository and configure:
   - Runtime: Python 3.9
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables from your .env file
5. Configure a persistent disk for model storage

### Option 2: Heroku Deployment

#### Backend Deployment

1. Create a new Heroku app
2. Add the Python buildpack
3. Configure environment variables in Heroku dashboard
4. Deploy using Git:

```bash
# Navigate to the server directory
cd server

# Initialize Git repository if not already done
git init
git add .
git commit -m "Initial commit"

# Add Heroku remote
heroku git:remote -a your-app-name

# Push to Heroku
git push heroku main
```

#### Frontend Deployment

1. Update API URL in the frontend code to point to your Heroku backend
2. Deploy to Vercel or Netlify as described above

## Model Management

### Loading Models in Production

The system uses a ModelRegistry class with LRU caching to efficiently load and manage models:

1. Models are loaded from the `/models` directory (or mounted volume in Docker)
2. The LRU cache ensures only the most recently used models stay in memory
3. Model metadata is stored in JSON files in the `/server/model_registry` directory

### Updating Models

To update a model:

1. Place the new model file in the appropriate directory under `/models`
2. Update the metadata in `/server/model_registry/{model_type}/v{version}/metadata.json`
3. Restart the server or call the model reloading endpoint

## Performance Optimization

### GPU Acceleration

If a GPU is available, the system will automatically use it for inference. Ensure your environment has:

- CUDA and cuDNN installed (for TensorFlow)
- Appropriate GPU drivers

The Docker setup includes the following environment variables to optimize GPU usage:

```
TF_FORCE_GPU_ALLOW_GROWTH=true
TF_CPP_MIN_LOG_LEVEL=2
```

### Memory Management

The system uses an LRU cache to manage model loading. You can configure the cache size using the `MODEL_CACHE_SIZE` environment variable.

## Security Considerations

1. **API Security**:
   - JWT authentication is implemented for API endpoints
   - CORS is configured to restrict access to specific origins in production

2. **Data Protection**:
   - Input validation is performed using Pydantic schemas
   - Secure practices for handling medical data are implemented

3. **Production Settings**:
   - Update the CORS settings in `main.py` to restrict access to your frontend domain
   - Use a strong, unique JWT secret key
   - Set appropriate JWT expiration time

## Troubleshooting

### Common Issues

1. **Model Loading Errors**:
   - Check that model files are in the correct location
   - Verify model format compatibility with TensorFlow version
   - Check for sufficient memory/GPU memory

2. **API Connection Issues**:
   - Verify CORS settings
   - Check network connectivity between frontend and backend
   - Ensure correct API URL is configured in frontend

3. **Performance Issues**:
   - Monitor memory usage with the provided monitoring tools
   - Adjust MODEL_CACHE_SIZE based on available memory
   - Enable GPU acceleration if available

### Logs and Monitoring

Access logs and monitoring information:

- API logs: Available in the Docker container logs
- Prometheus metrics: http://localhost:8000/metrics
- Health check: http://localhost:8000/health

## Maintenance

### Regular Updates

1. Keep dependencies updated:
   ```bash
   # Backend
   pip install -r requirements.txt --upgrade
   
   # Frontend
   npm update
   ```

2. Monitor for security vulnerabilities:
   ```bash
   # Backend
   pip-audit
   
   # Frontend
   npm audit
   ```

3. Perform regular backups of model files and metadata

## Conclusion

This deployment guide provides a comprehensive approach to reorganizing and deploying the Medical AI Diagnostics System. By following these instructions, you can ensure a clean project structure and reliable deployment across various environments.