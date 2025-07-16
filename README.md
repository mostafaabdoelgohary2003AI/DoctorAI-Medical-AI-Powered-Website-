# DoctorAI: AI-Powered Medical Diagnosis System 🩺💡

An advanced AI-powered medical diagnosis system built for DEPI AI Web Application project, featuring multiple ML models, comprehensive error handling, and production-ready Docker deployment.

## 🌟 Overview

DoctorAI is a robust web application that leverages AI to assist with medical diagnoses. It integrates multiple machine learning models to analyze medical images and provide insights on conditions like lung cancer, monkeypox, brain tumors, and more. Built with FastAPI (backend) and React (frontend), it offers a secure, scalable, and user-friendly interface for healthcare professionals.

<div id="1747963956071" style="width:100%;max-width:700px;height:525px;margin:auto;display:block;position: relative;border:2px solid #dee1e5;border-radius:3px;"><iframe allow="clipboard-write" allow="autoplay" allowfullscreen="true" allowfullscreen="true" style="width:100%;height:100%;border:none;" src="https://app.presentations.ai/view/jDywQi" scrolling="no"></iframe></div>

## ✨ Features

### 🏥 **Medical Image Analysis (5/7 Models Working)**
- 🫁 **Lung/Colon Cancer**: Analyze medical images for lung and colon cancer detection
- 🐒 **Monkeypox Detection**: Identify monkeypox from skin lesion images
- 🧠 **Brain Tumor Classification**: Detect and classify brain tumors from MRI scans
- 📱 **X-ray Analysis**: Comprehensive X-ray image analysis
- 🔬 **Anemia Detection**: Diagnose anemia using palm images with XGBoost

### 💬 **AI-Powered Medical Chatbot**
- Smart medical Q&A system
- Symptom analysis and preliminary advice
- Natural language processing for medical queries

### 🔒 **Enterprise-Grade Security**
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Secure session management with Redis
- Non-root Docker containers
- Read-only file system mounts

### 🚀 **Production-Ready Infrastructure**
- FastAPI backend with comprehensive error handling
- React frontend with optimized build
- Redis caching for improved performance
- Docker containerization with health checks
- Comprehensive logging and monitoring

## 📊 Current Model Status

| Model | Status | Description | Confidence |
|-------|--------|-------------|------------|
| 🫁 lung_colon | ✅ **Working** | Lung/Colon cancer detection | High accuracy |
| 🐒 monkeypox | ✅ **Working** | Monkeypox detection | 98-99% accuracy |
| 🧠 tumor | ✅ **Working** | Brain tumor classification | High reliability |
| 📱 xray | ✅ **Working** | X-ray analysis | Stable performance |
| 💬 chatbot | ✅ **Working** | Medical Q&A system | NLP-powered |
| 🦴 bone_fracture | 🚧 **Under Deployment** | TensorFlow Lite compatibility issues | Under review |
| 🔬 skin_cancer | 🚧 **Under Deployment** | Deprecated parameter issues | Requires retraining |

## 📋 Prerequisites

### **System Requirements**
- 🐳 **Docker Engine 20.10+** and **Docker Compose 2.0+**
- 🖥️ **4GB RAM minimum** (8GB recommended)
- 💾 **10GB free disk space** for models and images
- 🌐 **Internet connection** for initial setup

### **For Local Development**
- 🐍 **Python 3.9+**
- 🌐 **Node.js 18+**
- ☁️ **Azure account** (optional, for cloud storage)

## 🚀 Quick Start (Docker - Recommended)

### **1. Clone and Setup**
```bash
git clone https://github.com/yourusername/doctorai.git
cd DoctorAI-DEPI-AI-Web-Application
```

### **2. Environment Configuration**
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configurations (optional)
# AZURE_STORAGE_CONNECTION_STRING=your_connection_string_here
```

### **3. One-Command Deployment**
```bash
# Production deployment
docker-compose up -d

# Development with hot reloading
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### **4. Access the Application**
- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:8000
- 📚 **API Documentation**: http://localhost:8000/docs
- ❤️ **Health Check**: http://localhost:8000/health

## 🛠️ Manual Setup (Alternative)

### **Backend Setup**
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Start server with monitoring
python start_server.py

# Run health checks
python test_server.py
```

### **Frontend Setup**
```bash
cd react-app

# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build && npm run preview
```

## 🏥 Usage Guide

### **1. Medical Image Analysis**
```bash
# Upload image via web interface or API
curl -X POST "http://localhost:8000/predict/lung_colon" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@medical_image.jpg"

# Expected response:
{
  "result": "lung_squamous_cell_carcinoma",
  "confidence": 0.89,
  "description": "Comprehensive analysis indicates potential lung squamous cell carcinoma...",
  "model_used": "lung_colon",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### **2. Medical Chatbot**
```bash
# Ask medical questions
curl -X POST "http://localhost:8000/chatbot" \
  -H "Content-Type: application/json" \
  -d '{"message": "I have persistent headache and fever"}'

# Response:
{
  "response": "Based on your symptoms, this could indicate several conditions. Please consult a healthcare professional for proper evaluation...",
  "confidence": 0.85
}
```

### **3. Anemia Detection**
```bash
# Upload palm image for anemia detection
curl -X POST "http://localhost:8000/anemia_detection" \
  -H "Content-Type: application/json" \
  -d '[0.5, 0.3, 0.2, 0.1, 0.4]'  # Palm image features

# Response:
{
  "result": "Anemia Detected",
  "confidence": 0.87,
  "recommendation": "Consider consulting a healthcare provider for blood tests..."
}
```

## 🔧 Advanced Configuration

### **Environment Variables**
```env
# Backend Configuration
AZURE_STORAGE_CONNECTION_STRING=your_azure_connection
REDIS_URL=redis://redis:6379
MODEL_PATH=/app/models
LOG_LEVEL=INFO
SECRET_KEY=your_secret_key_here

# Security Settings
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENABLE_MODEL_CACHING=true
MAX_IMAGE_SIZE=10485760  # 10MB

# Frontend Configuration
VITE_API_URL=http://localhost:8000
NODE_ENV=production
```

### **Docker Commands**
```bash
# Production deployment
docker-compose up -d

# Development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Health monitoring
docker-compose ps
docker-compose logs -f

# Resource monitoring
docker stats

# Service restart
docker-compose restart backend

# Cleanup
docker-compose down
docker system prune -a
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │     Redis       │
│   (React+Vite)  │────│   (FastAPI)     │────│   (Cache)       │
│   Port: 5173    │    │   Port: 8000    │    │   Port: 6379    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────│   AI Models     │──────────────┘
                        │   (TensorFlow)  │
                        └─────────────────┘
```

## 🔍 Troubleshooting

### **Common Issues & Solutions**

#### **🚨 Server Startup Issues**
```bash
# Problem: "Error loading ASGI app"
# Solution: Ensure you're in the correct directory
cd backend
python start_server.py

# Problem: Port already in use
# Solution: Kill existing processes
docker-compose down
```

#### **🤖 Model Loading Issues**
```bash
# Check model files
docker-compose exec backend ls -la /app/models/

# View detailed logs
docker-compose logs backend | grep -i error

# Test specific model
docker-compose exec backend python -c "
from main import models
print('Available models:', list(models.keys()))
"
```

#### **🌐 API Connection Issues**
```bash
# Test backend connectivity
curl http://localhost:8000/health

# Check frontend environment
docker-compose exec frontend env | grep VITE_API_URL

# Network debugging
docker-compose exec frontend curl http://backend:8000/health
```

### **Performance Optimization**
- Ensure Docker has sufficient RAM (4GB minimum)
- Use SSD storage for better I/O performance
- Enable Redis caching for faster model responses
- Monitor container resource usage with `docker stats`

## ☁️ Cloud Deployment

### **Azure Deployment**
```bash
# 1. Build and push images
docker build -t yourregistry.azurecr.io/doctorai-backend ./backend
docker build -t yourregistry.azurecr.io/doctorai-frontend ./react-app

docker push yourregistry.azurecr.io/doctorai-backend
docker push yourregistry.azurecr.io/doctorai-frontend

# 2. Deploy with Azure Container Instances
az container create \
  --resource-group doctorai-rg \
  --name doctorai-app \
  --image yourregistry.azurecr.io/doctorai-backend \
  --ports 8000 \
  --environment-variables REDIS_URL=redis://redis:6379
```

### **Production Considerations**
- 🔒 Use Azure Key Vault for secrets management
- 📊 Implement Azure Monitor for logging and metrics
- 🚀 Use Azure Container Registry for image storage
- 🌍 Configure Azure CDN for frontend assets
- 🔄 Set up CI/CD pipelines with Azure DevOps

## 🧪 Testing & Quality Assurance

### **Automated Testing**
```bash
# Backend API testing
docker-compose exec backend python test_server.py

# Frontend testing
docker-compose exec frontend npm test

# Integration testing
curl -X POST "http://localhost:8000/predict/lung_colon" \
  -F "file=@test_images/sample_xray.jpg"
```

### **Model Performance Monitoring**
- Confidence score analysis for all predictions
- Response time monitoring for API endpoints
- Error rate tracking and alerting
- Model accuracy validation with test datasets

## 📚 API Documentation

Full interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### **Key Endpoints**
- `POST /predict/{model_name}` - Medical image analysis
- `POST /chatbot` - Medical Q&A
- `POST /anemia_detection` - Anemia detection from palm features
- `GET /health` - System health check
- `POST /auth/login` - User authentication
- `GET /models/status` - Model availability status

## 🔐 Security Features

- ✅ **JWT Authentication** with refresh tokens
- ✅ **Password Hashing** using bcrypt
- ✅ **CORS Protection** for cross-origin requests
- ✅ **Input Validation** and sanitization
- ✅ **Rate Limiting** for API endpoints
- ✅ **Secure Headers** implementation
- ✅ **Non-root Containers** for enhanced security
- ✅ **Read-only File Systems** where applicable

## 👥 Team & Acknowledgments

### **Core Development Team**
- 👑 **Mostafa Abdo** - Lead Developer & Architecture
  - AI Developer 
  - Full Stack Development
  - MLOps & Infrastructure
  - Security Implementation
- 💬 **Menna Ateya** - Chatbot Developer
- 🔧 **Adel Mahmoud** - AI Developer
- 🧠 **Yousef Alaa** - Machine Learning Engineer
- 🤖 **Mohamed Osama** - AI Developer
- 📊 **Mohamed Ahmed Talba** - AI Developer

### **Special Thanks**
- 🎓 **DEPI AI Program** for the educational opportunity
- 👨‍🏫 **Our Instructors** for guidance and mentorship
- 🤝 **Open Source Community** for tools and libraries
- 🏥 **Healthcare Professionals** for domain expertise

## 📄 License & Legal

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **Medical Disclaimer**
⚠️ **IMPORTANT**: This application is for educational and research purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions regarding medical conditions.

## 🔄 Version History

### **v2.0.0** (Current) - Production Ready
- ✅ Complete Docker containerization
- ✅ Enhanced error handling and logging
- ✅ Security hardening and authentication
- ✅ 5/7 models working reliably
- ✅ Comprehensive monitoring and health checks

### **v1.0.0** - Initial Release
- Basic model integration
- Simple web interface
- Core functionality implementation

---

🩺 **Built with ❤️ for better healthcare** 🩺

For detailed setup instructions, see [DOCKER_SETUP.md](DOCKER_SETUP.md)  
For troubleshooting, see [backend/TROUBLESHOOTING.md](backend/TROUBLESHOOTING.md)
