# DoctorAI Backend Documentation

## Overview

The DoctorAI backend is a high-performance API server built with FastAPI and Python 3.9+. It serves as the core engine for AI-powered medical diagnosis, handling image processing, model inference, authentication, and data management with production-ready scalability and security.

## Technology Stack

### Core Framework
- **FastAPI 0.115.0**: Modern, fast web framework with automatic API documentation
- **Uvicorn**: ASGI server for production deployment
- **Python 3.9+**: Runtime environment with type hints support
- **Pydantic 2.9.2**: Data validation and settings management

### AI/ML Libraries
- **TensorFlow 2.17.0**: Primary ML framework for medical imaging models
- **PyTorch 2.0+**: Deep learning framework for NLP models
- **Transformers 4.51.0+**: HuggingFace library for T5 medical chatbot
- **XGBoost 2.1.1**: Traditional ML for structured data analysis
- **NumPy 1.26.4**: Numerical computing foundation
- **Pillow 10.4.0**: Image processing and manipulation

### Security & Authentication
- **python-jose[cryptography] 3.3.0**: JWT token handling
- **passlib[bcrypt] 1.7.4**: Password hashing and verification
- **python-multipart 0.0.12**: Multipart form data handling

### Data & Caching
- **Redis 5.0.1**: Session management and result caching
- **SentencePiece 0.2.0+**: Tokenization for NLP models

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── start_server.py         # Production server launcher
├── requirements.txt        # Python dependencies
├── Dockerfile             # Container configuration
├── models/                # AI model storage directory
│   ├── chatbot/          # T5 medical chatbot model
│   ├── skin_cancer/      # Skin cancer model (removed)
│   ├── palm_disease/     # Anemia detection XGBoost model
│   └── *.h5              # TensorFlow Keras models
├── test_*.py             # Testing and validation scripts
├── audit.log             # Security and operation logs
└── TROUBLESHOOTING.md    # Backend-specific troubleshooting
```

## Architecture & Design Patterns

### Application Architecture
- **Async/Await Pattern**: Non-blocking I/O operations
- **Dependency Injection**: FastAPI's built-in DI system
- **Middleware Chain**: CORS, authentication, logging
- **Error Handling**: Comprehensive exception management
- **Health Monitoring**: Built-in health check endpoints

### Model Loading Strategy
- **Lazy Loading**: Models loaded on first request
- **Memory Management**: Efficient model caching
- **Error Resilience**: Graceful degradation on model failures
- **Hot Swapping**: Runtime model updates (future)

### Security Architecture
- **JWT Authentication**: Stateless token-based auth
- **Password Security**: bcrypt hashing with salt
- **Input Validation**: Pydantic model validation
- **Rate Limiting**: Request throttling per endpoint
- **Audit Logging**: Comprehensive security event tracking

## API Endpoints

### Medical Image Analysis APIs (Currently Deployed)

#### Lung/Colon Cancer Detection
```http
POST /api/lung_colon
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>

Response:
{
  "result": "lung_adenocarcinoma",
  "confidence": 0.89,
  "description": "Detailed medical analysis",
  "timestamp": "2024-12-07T10:30:00Z",
  "model_size": "85MB",
  "processing_time": "200ms"
}
```

#### Monkeypox Detection
```http
POST /api/monkeypox
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>

Response:
{
  "result": "Monkeypox",
  "confidence": 0.98,
  "description": "High probability detection",
  "timestamp": "2024-12-07T10:30:00Z",
  "model_size": "92MB",
  "processing_time": "250ms"
}
```

#### Brain Tumor Classification
```http
POST /api/tumor
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>

Response:
{
  "result": "Glioma",
  "confidence": 0.94,
  "description": "Tumor classification analysis",
  "timestamp": "2024-12-07T10:30:00Z",
  "model_size": "78MB",
  "processing_time": "150ms"
}
```

### APIs Under Deployment

#### X-ray Analysis (🚧 Under Deployment)
```http
POST /api/xray
Content-Type: multipart/form-data

# Pneumonia detection from chest X-rays
```

#### Medical Chatbot (🚧 Under Deployment)
```http
POST /api/chatbot
Content-Type: application/json

{
  "message": "I have persistent headache and fever"
}

Response:
{
  "response": "Medical consultation response...",
  "confidence": 0.85,
  "language": "english",
  "disclaimer": "Professional consultation required"
}
```

#### Palm Disease Analysis (🚧 Under Deployment)
```http
POST /api/palm_disease
Content-Type: application/json

[0.5, 0.3, 0.2, 0.1, 0.4]  # Feature vector

Response:
{
  "result": "Anemia Detected",
  "confidence": 0.87,
  "recommendation": "Consult healthcare provider"
}
```

### System APIs

#### Health Check
```http
GET /api/health

Response:
{
  "status": "healthy",
  "timestamp": "2024-12-07T10:30:00Z",
  "models": {
    "lung_colon": true,
    "monkeypox": true,
    "tumor": true,
    "xray": false,
    "chatbot": false,
    "palm_disease": false
  },
  "summary": "3/6 models available"
}
```

#### Authentication
```http
POST /api/token
Content-Type: application/x-www-form-urlencoded

username=admin&password=password

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGci...",
  "token_type": "bearer"
}
```

#### API Documentation
```http
GET /docs      # Swagger UI documentation
GET /redoc     # ReDoc documentation
```

## Model Integration

### TensorFlow/Keras Models (.h5 Format)

#### Model Loading Architecture
```python
# Model loading with error handling
def load_keras_model(model_path):
    try:
        model = tf.keras.models.load_model(model_path)
        return model
    except Exception as e:
        return None
```

#### Deployed Models
- **Lung/Colon Cancer**: `Model.h5` (85MB) - DenseNet201 architecture
- **Monkeypox Detection**: `DEPI_FINAL_MONKEYPOX_MODEL.h5` (92MB) - Enhanced DenseNet201
- **Brain Tumor**: `Tumor.h5` (78MB) - Custom CNN architecture

#### Model Specifications
```python
# Model class mappings
LUNG_COLON_CLASSES = [
    "Colon Adenocarcinoma",
    "Colon Benign Tissue", 
    "Lung Adenocarcinoma",
    "Lung Benign Tissue",
    "Lung Squamous Cell Carcinoma"
]

MONKEYPOX_CLASSES = [
    "Monkeypox",
    "Non-Monkeypox"
]

TUMOR_CLASSES = [
    "Glioma",
    "Meningioma", 
    "No Tumor",
    "Pituitary"
]
```

### PyTorch Models

#### T5 Medical Chatbot (araT5-medical-bot)
- **Model Type**: T5ForConditionalGeneration
- **Size**: 98MB with ~220M parameters
- **Languages**: Arabic (primary), English (secondary)
- **Format**: Safetensors for security
- **Device**: CPU/CUDA automatic detection

#### Generation Configuration
```python
generation_kwargs = {
    "max_length": 200,
    "min_length": 15,
    "num_beams": 4,
    "do_sample": True,
    "temperature": 1.1,
    "top_p": 0.85,
    "repetition_penalty": 1.8,
    "no_repeat_ngram_size": 4
}
```

### XGBoost Models

#### Palm Disease Analysis
- **Model Type**: XGBoost Classifier
- **File**: `XGB-Tuned-balancedPalm.pkl` (2MB)
- **Purpose**: Anemia detection from palm image features
- **Classes**: Healthy, Fusarium Wilt, Leaf Spot

## Image Processing Pipeline

### Image Preprocessing
```python
def preprocess_image(image: Image.Image, target_size=(224, 224)):
    # Convert to RGB, resize, normalize
    image = image.convert('RGB')
    image = image.resize(target_size)
    image_array = np.array(image) / 255.0
    return np.expand_dims(image_array, axis=0).astype(np.float32)
```

### Validation Rules
- **Supported Formats**: JPG, PNG, JPEG
- **Maximum Size**: 10MB per image
- **Resolution**: Automatically resized to 224x224
- **Color Space**: RGB conversion applied

### Processing Flow
1. **Upload Validation**: File type and size checks
2. **Hash Generation**: SHA256 for cache lookup
3. **Cache Check**: Redis-based result caching
4. **Image Processing**: PIL-based preprocessing
5. **Model Inference**: TensorFlow/PyTorch prediction
6. **Post-processing**: Confidence scoring and formatting
7. **Response**: JSON with results and metadata

## Authentication & Security

### JWT Implementation
- **Algorithm**: HS256
- **Expiration**: 30 minutes (configurable)
- **Refresh**: Automatic token renewal
- **Storage**: Stateless server-side validation

### Password Security
- **Hashing**: bcrypt with automatic salt
- **Rounds**: 12 rounds (configurable)
- **Validation**: Secure password verification
- **Storage**: Never store plain text passwords

### Security Middleware
- **CORS**: Configurable cross-origin policies
- **Rate Limiting**: Request throttling implementation
- **Input Sanitization**: Pydantic validation
- **Error Masking**: Sanitized error responses

### Audit Logging
```python
# Security event logging
logging.basicConfig(filename='audit.log', level=logging.INFO)
logging.info(f"Authentication attempt: {username} at {timestamp}")
logging.info(f"Model prediction: {model_name} at {timestamp}")
```

## Caching Strategy

### Redis Implementation
- **Session Storage**: JWT token validation
- **Result Caching**: Model prediction caching
- **Cache Keys**: SHA256 hash-based
- **TTL**: 1 hour for predictions
- **Fallback**: Graceful degradation without Redis

### Cache Hit Optimization
```python
# Cache lookup pattern
cache_key = f"{endpoint}:{file_hash}"
cached_result = redis_client.get(cache_key)
if cached_result:
    return json.loads(cached_result)
```

## Performance Optimization

### Async Processing
- **FastAPI Async**: Non-blocking request handling
- **Concurrent Requests**: Multiple simultaneous predictions
- **Background Tasks**: Logging and cleanup operations
- **Connection Pooling**: Efficient resource utilization

### Memory Management
- **Model Loading**: Lazy initialization on first use
- **Garbage Collection**: Automatic memory cleanup
- **Resource Monitoring**: Memory usage tracking
- **Optimization**: Model weight sharing

### Response Time Optimization
- **Model Caching**: Pre-loaded models in memory
- **Result Caching**: Redis-based response caching
- **Compression**: Response compression for large payloads
- **CDN Ready**: Static asset optimization

## Error Handling

### Exception Hierarchy
```python
# Custom exception handling
class ModelNotAvailableError(HTTPException):
    status_code = 503
    detail = "Model is not available"

class ValidationError(HTTPException):
    status_code = 422
    detail = "Input validation failed"
```

### Graceful Degradation
- **Model Failures**: Individual model error isolation
- **Cache Failures**: Fallback to direct computation
- **Network Issues**: Retry mechanisms with backoff
- **Resource Limits**: Queue management and throttling

### Logging Strategy
- **Error Levels**: DEBUG, INFO, WARNING, ERROR, CRITICAL
- **Structured Logging**: JSON-formatted log entries
- **Correlation IDs**: Request tracking across services
- **Metrics**: Performance and error rate monitoring

## Environment Configuration

### Environment Variables
```bash
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
LOG_LEVEL=INFO

# Security
SECRET_KEY=your_secure_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Model Configuration
MODEL_PATH=/app/models
ENABLE_MODEL_CACHING=true
MAX_IMAGE_SIZE=10485760

# External Services
REDIS_URL=redis://redis:6379
AZURE_STORAGE_CONNECTION_STRING=optional_azure_connection

# AI/ML Configuration
CHATBOT_USE_GPU=false
PYTORCH_AVAILABLE=true
```

### Production Configuration
- **Debug Mode**: Disabled in production
- **CORS Origins**: Restricted to known domains
- **SSL/TLS**: HTTPS enforcement
- **Security Headers**: Additional security middleware

## Testing & Validation

### Test Scripts
- **test_server.py**: Basic health and connectivity tests
- **test_chatbot_integration.py**: Chatbot functionality testing
- **test_response_diversity.py**: Response quality validation
- **test_pytorch_chatbot.py**: PyTorch model testing

### Testing Strategy
```bash
# Health check testing
python test_server.py

# Model integration testing
python test_chatbot_integration.py

# API endpoint testing
curl -X POST "http://localhost:8000/api/monkeypox" -F "file=@test.jpg"
```

### Validation Metrics
- **Response Time**: < 300ms for 95th percentile
- **Accuracy**: Model-specific accuracy thresholds
- **Uptime**: > 99% availability target
- **Error Rate**: < 1% for production endpoints

## Deployment Configuration

### Docker Integration
- **Base Image**: Python 3.9-slim
- **Multi-stage Build**: Optimized production image
- **Health Checks**: Container health monitoring
- **Volume Mounts**: Model files and persistent logs

### Production Settings
```python
# Uvicorn configuration
uvicorn.run(
    "main:app",
    host="0.0.0.0",
    port=8000,
    reload=False,  # Production
    workers=4,     # Multi-worker
    access_log=True
)
```

### Monitoring & Health Checks
- **Endpoint**: `/api/health` for container health
- **Metrics**: Response time, error rate, model status
- **Alerts**: Automated notification system
- **Restart Policy**: Automatic container restart on failure

## Troubleshooting

### Common Issues

#### Model Loading Failures
```bash
# Check model files exist
ls -la /app/models/
docker-compose exec backend ls -la /app/models/

# Verify model integrity
python -c "import tensorflow as tf; tf.keras.models.load_model('model.h5')"
```

#### Memory Issues
```bash
# Monitor memory usage
docker stats
free -h

# Increase Docker memory allocation
# Docker Desktop > Settings > Resources > Memory: 8GB+
```

#### Authentication Problems
```bash
# Verify JWT token
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/health

# Check secret key configuration
echo $SECRET_KEY
```

### Performance Debugging
- **Profiling**: Python profiler for bottleneck identification
- **Logging**: Detailed request/response logging
- **Metrics**: Response time and throughput monitoring
- **Resource Usage**: CPU, memory, and I/O monitoring

## Future Enhancements

### Planned Features
- **Model Versioning**: A/B testing and rollback capabilities
- **Batch Processing**: Multiple image processing
- **WebSocket Support**: Real-time communication
- **Advanced Caching**: Multi-level caching strategy
- **Microservices**: Service decomposition for scalability

### Scalability Improvements
- **Horizontal Scaling**: Multi-instance deployment
- **Load Balancing**: Request distribution
- **Database Integration**: Persistent data storage
- **Message Queues**: Asynchronous task processing
- **Auto-scaling**: Dynamic resource allocation

This backend documentation provides comprehensive coverage of the DoctorAI server architecture, implementation details, and operational procedures for development and production environments. 