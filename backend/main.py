from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import tflite_runtime.interpreter as tflite
import xgboost as xgb
import numpy as np
from PIL import Image
import io
import pickle
from typing import List
from redis import Redis
import json
import logging
from datetime import datetime, timedelta
import hashlib
from tensorflow.keras.preprocessing.sequence import pad_sequences
import tensorflow as tf
import os

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis client for caching
redis_client = Redis(host='redis', port=6379, db=0)

# Setup logging
logging.basicConfig(filename='audit.log', level=logging.INFO)

# JWT Authentication
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")  # Use environment variable in production
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")

# JWT Token Endpoint
@app.post("/api/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username == "admin" and form_data.password == "password":  # Replace with real user validation
        access_token_expires = timedelta(minutes=30)
        access_token = jwt.encode(
            {"sub": form_data.username, "exp": datetime.utcnow() + access_token_expires},
            SECRET_KEY,
            algorithm=ALGORITHM
        )
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# Load TFLite models
def load_tflite_model(model_path):
    interpreter = tflite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()
    return interpreter

# Load models (using TFLite for most models, Keras for skin_cancer)
bone_fracture_interpreter = load_tflite_model("models/bone_fracture.tflite")
lung_colon_interpreter = load_tflite_model("models/lung_colon.tflite")
monkeypox_interpreter = load_tflite_model("models/monkeypox.tflite")
skin_cancer_model = tf.keras.models.load_model("models/skin_cancer/DEPI_SKIN_CANCER_MODEL.h5")  # Fallback to Keras
tumor_interpreter = load_tflite_model("models/tumor.tflite")
xray_interpreter = load_tflite_model("models/xray.tflite")
chatbot_interpreter = load_tflite_model("models/chatbot.tflite")  # Now using TFLite
palm_disease_model = xgb.Booster()
palm_disease_model.load_model("models/palm_disease/XGB-Tuned-balancedPalm.pkl")

# Load chatbot tokenizer
with open('models/tokenizer.pkl', 'rb') as f:
    tokenizer = pickle.load(f)

# Class labels for each model
BONE_FRACTURE_CLASSES = ["Not Fractured", "Fractured"]
LUNG_COLON_CLASSES = ["Colon Adenocarcinoma", "Colon Benign Tissue", "Lung Adenocarcinoma", "Lung Benign Tissue", "Lung Squamous Cell Carcinoma"]
MONKEYPOX_CLASSES = ["Non-Monkeypox", "Monkeypox"]
SKIN_CANCER_CLASSES = [
    "melanocytic nevi", "melanoma", "benign keratosis-like lesions",
    "basal cell carcinoma", "pyogenic granulomas and hemorrhage",
    "Actinic keratoses and intraepithelial carcinomae", "dermatofibroma"
]
TUMOR_CLASSES = ["Pituitary", "notumor", "meninigioma", "glioma"]
XRAY_CLASSES = ["normal", "pneumonia"]
PALM_DISEASE_CLASSES = ["Healthy", "Fusarium Wilt", "Leaf Spot"]

# Preprocessing function for image-based models
def preprocess_image(image: Image.Image, target_size=(224, 224)):
    image = image.convert('RGB')  # Remove metadata and alpha channel
    image = image.resize(target_size)
    image_array = np.array(image) / 255.0  # Normalize
    return np.expand_dims(image_array, axis=0).astype(np.float32)

# Helper function to run TFLite inference
def run_tflite_inference(interpreter, input_data):
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    prediction = interpreter.get_tensor(output_details[0]['index'])
    return prediction

# Generic prediction function with caching for TFLite models
async def predict_with_cache_tflite(file: UploadFile, interpreter, classes, endpoint: str):
    try:
        file_content = await file.read()
        file_hash = hashlib.sha256(file_content).hexdigest()
        cache_key = f"{endpoint}:{file_hash}"
        cached_result = redis_client.get(cache_key)
        if cached_result:
            return json.loads(cached_result)

        image = Image.open(io.BytesIO(file_content))
        image_array = preprocess_image(image)
        prediction = run_tflite_inference(interpreter, image_array)
        confidence = float(np.max(prediction))
        result = classes[np.argmax(prediction)]

        response = {"result": result, "confidence": confidence}
        redis_client.setex(cache_key, 3600, json.dumps(response))
        logging.info(f"{endpoint} request at {datetime.now()}: {result}")
        return response
    except Exception as e:
        logging.error(f"Error in {endpoint}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Prediction function for Keras model (skin_cancer fallback)
async def predict_with_cache_keras(file: UploadFile, model, classes, endpoint: str):
    try:
        file_content = await file.read()
        file_hash = hashlib.sha256(file_content).hexdigest()
        cache_key = f"{endpoint}:{file_hash}"
        cached_result = redis_client.get(cache_key)
        if cached_result:
            return json.loads(cached_result)

        image = Image.open(io.BytesIO(file_content))
        image_array = preprocess_image(image)
        prediction = model.predict(image_array, verbose=0)
        confidence = float(np.max(prediction))
        result = classes[np.argmax(prediction)]

        response = {"result": result, "confidence": confidence}
        redis_client.setex(cache_key, 3600, json.dumps(response))
        logging.info(f"{endpoint} request at {datetime.now()}: {result}")
        return response
    except Exception as e:
        logging.error(f"Error in {endpoint}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Endpoints for TFLite models
@app.post("/api/bone_fracture")
async def predict_bone_fracture(file: UploadFile = File(...), token: str = Depends(oauth2_scheme)):
    return await predict_with_cache_tflite(file, bone_fracture_interpreter, BONE_FRACTURE_CLASSES, "bone_fracture")

@app.post("/api/lung_colon")
async def predict_lung_colon(file: UploadFile = File(...), token: str = Depends(oauth2_scheme)):
    return await predict_with_cache_tflite(file, lung_colon_interpreter, LUNG_COLON_CLASSES, "lung_colon")

@app.post("/api/monkeypox")
async def predict_monkeypox(file: UploadFile = File(...), token: str = Depends(oauth2_scheme)):
    return await predict_with_cache_tflite(file, monkeypox_interpreter, MONKEYPOX_CLASSES, "monkeypox")

# Endpoint for skin_cancer (using Keras model)
@app.post("/api/skin_cancer")
async def predict_skin_cancer(file: UploadFile = File(...), token: str = Depends(oauth2_scheme)):
    return await predict_with_cache_keras(file, skin_cancer_model, SKIN_CANCER_CLASSES, "skin_cancer")

@app.post("/api/tumor")
async def predict_tumor(file: UploadFile = File(...), token: str = Depends(oauth2_scheme)):
    return await predict_with_cache_tflite(file, tumor_interpreter, TUMOR_CLASSES, "tumor")

@app.post("/api/xray")
async def predict_xray(file: UploadFile = File(...), token: str = Depends(oauth2_scheme)):
    return await predict_with_cache_tflite(file, xray_interpreter, XRAY_CLASSES, "xray")

# Endpoint for chatbot (using TFLite)
@app.post("/api/chatbot")
async def predict_chatbot(request: dict = Body(...), token: str = Depends(oauth2_scheme)):
    try:
        text = request.get("message", "")
        if not text:
            raise HTTPException(status_code=400, detail="Message is required")

        cache_key = f"chatbot:{hashlib.sha256(text.encode()).hexdigest()}"
        cached_result = redis_client.get(cache_key)
        if cached_result:
            return json.loads(cached_result)

        sequence = tokenizer.texts_to_sequences([text])
        padded = pad_sequences(sequence, maxlen=100, padding='post')
        prediction = chatbot_model.predict(padded, verbose=0)
        
        response = "I understand your concern. Based on your input, I recommend consulting a healthcare professional for a detailed diagnosis."
        if np.max(prediction) > 0.7:
            response = "It seems like your symptoms might indicate a serious condition. Please seek medical advice immediately."

        result = {"response": response}
        redis_client.setex(cache_key, 3600, json.dumps(result))
        logging.info(f"chatbot request at {datetime.now()}: {text} -> {response}")
        return result
    except Exception as e:
        logging.error(f"Error in chatbot: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint for palm disease (XGBoost)
@app.post("/api/palm_disease")
async def predict_palm_disease(features: List[float], token: str = Depends(oauth2_scheme)):
    try:
        cache_key = f"palm_disease:{hashlib.sha256(str(features).encode()).hexdigest()}"
        cached_result = redis_client.get(cache_key)
        if cached_result:
            return json.loads(cached_result)

        features_array = np.array([features])
        dmatrix = xgb.DMatrix(features_array)
        prediction = palm_disease_model.predict(dmatrix)
        probability = palm_disease_model.predict_proba(dmatrix)[0].max()
        result = PALM_DISEASE_CLASSES[int(prediction[0])]

        response = {"result": result, "confidence": float(probability)}
        redis_client.setex(cache_key, 3600, json.dumps(response))
        logging.info(f"palm_disease request at {datetime.now()}: {result}")
        return response
    except Exception as e:
        logging.error(f"Error in palm_disease: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Middleware to validate JWT token
@app.middleware("http")
async def validate_jwt(request, call_next):
    if request.url.path in ["/api/token", "/api/health"]:
        return await call_next(request)
    try:
        token = await oauth2_scheme(request)
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except (JWTError, Exception) as e:
        logging.error(f"JWT validation failed: {str(e)}")
        return {"detail": "Invalid or missing token", "status_code": 401}
    return await call_next(request)