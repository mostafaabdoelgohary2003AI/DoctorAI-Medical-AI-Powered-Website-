# DoctorAI: AI-Powered Medical Diagnosis System 🩺💡

An AI-powered medical diagnosis system built for DEPI AI Web Application project.

## 🌟 Overview

DoctorAI is a web application that leverages AI to assist with medical diagnoses. It integrates multiple machine learning models to analyze medical images and provide insights on conditions like bone fractures, skin cancer, and more. Built with FastAPI (backend) and React (frontend), it offers a user-friendly interface for healthcare professionals and patients.
```html
<div id="1747963956071" style="width:100%;max-width:700px;height:525px;margin:auto;display:block;position: relative;border:2px solid #dee1e5;border-radius:3px;"><iframe allow="clipboard-write" allow="autoplay" allowfullscreen="true" allowfullscreen="true" style="width:100%;height:100%;border:none;" src="https://app.presentations.ai/view/jDywQi" scrolling="no"></iframe></div>
```

## ✨ Features

- 🩻 **Image-Based Diagnosis**: Analyze X-rays, MRIs, and skin images for conditions like bone fractures, lung cancer, monkeypox, skin cancer, brain tumors, and pneumonia.
- 💬 **Chatbot**: A medical chatbot to provide preliminary advice based on user symptoms.
- 🖐️ **Anemia Detection**: Diagnose anemia using palm images with XGBoost.
- 🔒 **Secure Authentication**: JWT-based authentication for secure access.
- 🚀 **Scalable Backend**: Built with FastAPI, Redis caching, and Docker for efficient performance.

## 📋 Prerequisites

Before setting up DoctorAI, ensure you have the following installed:

- 🐳 Docker and Docker Compose
- 🐍 Python 3.7+ (for local development)
- 🌐 Node.js 18+ (for the React frontend)
- ☁️ Azure account (for deployment)
- 📦 Git

## ⚙️ Setup Instructions

Follow these steps to set up DoctorAI locally:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/doctorai.git
cd doctorai
```

### 2. Download Models

The models (1.69 GB) are stored in Azure Blob Storage due to their size. Download them using the Azure CLI:

```bash
az storage blob download-batch --account-name yourstorageaccount --source models --destination ./models
```

Ensure the models/ directory contains:

- bone_fracture.tflite, lung_colon.tflite, monkeypox.tflite, tumor.tflite, xray.tflite, chatbot.tflite
- skin_cancer/DEPI_SKIN_CANCER_MODEL.h5 (not converted to TFLite)
- anemia_detection/XGB-Tuned-balancedPalm.pkl
- tokenizer.pkl

### 3. Set Up the Backend

**Install Dependencies:**

```bash
cd backend
pip install -r requirements.txt
```

**Environment Variables:**

Create a .env file in the backend/ directory:

```
SECRET_KEY=your-secret-key
```

### 4. Set Up the Frontend

**Install Dependencies:**

```bash
cd react-app
npm install
```

**Environment Variables:**

Create a .env file in the react-app/ directory:

```
VITE_API_URL=http://localhost:8000
```

### 5. Run the Application with Docker

From the project root, run:

```bash
docker-compose up --build
```

- Backend will be available at http://localhost:8000.
- Frontend will be available at http://localhost:5173.

## 🚀 Usage

### 1. Access the Web Application

Open your browser and navigate to http://localhost:5173.

Log in with the default credentials:
- **Username**: admin
- **Password**: password

### 2. Image-Based Diagnosis

- Navigate to the diagnosis section.
- Upload an image (e.g., X-ray, MRI, skin photo).
- Select the condition to diagnose (e.g., Bone Fracture, Skin Cancer).
- View the prediction and confidence score.

### 3. Chatbot

- Go to the chatbot section.
- Enter your symptoms (e.g., "I have a headache and fever").
- Receive a preliminary recommendation.

**Example:**

```json
# POST /api/chatbot
{
  "message": "I have a headache and fever"
}

# Response:
{
  "response": "It seems like your symptoms might indicate a serious condition. Please seek medical advice immediately."
}
```

### 4. Anemia Detection

- Navigate to the anemia detection section.
- Upload a palm image or input extracted features from the palm.
- Get the anemia diagnosis.

**Example:**

```json
# POST /api/anemia_detection
[
  0.5, 0.3, 0.2, 0.1, 0.4  // Example palm image features
]

# Response:
{
  "result": "Anemia Detected",
  "confidence": 0.87
}
```

## 📝 Notes on Models

- ⚠️ **Skin Cancer Model**: The skin_cancer model (DEPI_SKIN_CANCER_MODEL.h5) could not be converted to TFLite due to an incompatible reduction=auto parameter in the loss function. It is loaded directly as a .h5 file in main.py.
- ⚠️ **Chatbot Model**: The chatbot model (chatbot.tflite) uses Flex ops (FlexTensorListReserve, FlexTensorListSetItem, FlexTensorListStack). Ensure your runtime environment supports the Flex delegate (e.g., TensorFlow 2.16+).
- 🔍 **Model Conversion**: Use convert_to_tflite.py to convert .h5 or .keras models to TFLite. See convert_skin_cancer_to_tflite.py for the attempted conversion of the skin_cancer model.

## ☁️ Deployment on Azure

### 1. Backend (Azure App Service)

**Build the Docker image:**

```bash
docker build -t doctorai-backend -f backend/Dockerfile .
```

**Push to Azure Container Registry:**

```bash
az acr login --name yourregistry
docker tag doctorai-backend yourregistry.azurecr.io/doctorai-backend
docker push yourregistry.azurecr.io/doctorai-backend
```

**Deploy to Azure App Service:**

```bash
az webapp create --resource-group yourgroup --name doctorai-backend --plan yourplan --deployment-container-image-name yourregistry.azurecr.io/doctorai-backend
```

### 2. Frontend (Azure Static Web Apps)

**Build the React app:**

```bash
cd react-app
npm run build
```

**Deploy using Azure Static Web Apps CLI:**

```bash
swa deploy --resource-group yourgroup --app-name doctorai-frontend
```

Update VITE_API_URL in the frontend to the Azure backend URL.

## 👥 Team & Acknowledgments

### Team Members:

- 👩‍💻 [Your Name] - Backend Developer
- 👨‍💻 [Team Member 2] - Frontend Developer
- 👩‍🔬 [Team Member 3] - Machine Learning Engineer

### Acknowledgments:

- Thanks to DEPI AI for the project opportunity.
- Special thanks to our instructor for guidance.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for better healthcare.
