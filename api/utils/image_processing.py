import numpy as np
import cv2
import base64
import io
from PIL import Image
from typing import Tuple, List, Dict, Any, Union
import logging

# Configure logging
logger = logging.getLogger("image_processing")

class ImageProcessor:
    """Utility class for image processing operations"""
    
    @staticmethod
    def decode_base64(image_data: str) -> Image.Image:
        """Decode base64 encoded image data to PIL Image"""
        try:
            # Handle data URI scheme if present
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            # Decode base64 string
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            return image
        except Exception as e:
            logger.error(f"Error decoding base64 image: {e}")
            raise ValueError(f"Invalid image data: {str(e)}")
    
    @staticmethod
    def preprocess_for_skin_cancer(image_data: str, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
        """Preprocess image for skin cancer model"""
        image = ImageProcessor.decode_base64(image_data)
        
        # Convert to RGB if needed
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Resize image
        image = image.resize(target_size)
        
        # Convert to numpy array and normalize
        img_array = np.array(image) / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    @staticmethod
    def preprocess_for_monkeypox(image_data: str, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
        """Preprocess image for monkeypox model"""
        return ImageProcessor.preprocess_for_skin_cancer(image_data, target_size)
    
    @staticmethod
    def preprocess_for_bone_fracture(image_data: str, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
        """Preprocess image for bone fracture model"""
        image = ImageProcessor.decode_base64(image_data)
        
        # Convert to grayscale for X-ray images
        image = image.convert("L")
        
        # Resize image
        image = image.resize(target_size)
        
        # Convert to numpy array and normalize
        img_array = np.array(image) / 255.0
        
        # Add channel dimension and batch dimension
        img_array = np.expand_dims(np.expand_dims(img_array, axis=-1), axis=0)
        
        return img_array
    
    @staticmethod
    def preprocess_for_tumor(image_data: str, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
        """Preprocess image for brain tumor model"""
        return ImageProcessor.preprocess_for_skin_cancer(image_data, target_size)
    
    @staticmethod
    def preprocess_for_xray(image_data: str, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
        """Preprocess image for X-ray model"""
        return ImageProcessor.preprocess_for_bone_fracture(image_data, target_size)
    
    @staticmethod
    def preprocess_for_lung_colon(image_data: str, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
        """Preprocess image for lung and colon cancer model"""
        return ImageProcessor.preprocess_for_skin_cancer(image_data, target_size)
    
    @staticmethod
    def preprocess_for_palm_disease(image_data: str, features: Dict[str, Any], target_size: Tuple[int, int] = (224, 224)) -> Dict[str, Any]:
        """Preprocess image and features for palm disease model"""
        # Process image if provided
        processed_data = {}
        
        if image_data:
            image = ImageProcessor.decode_base64(image_data)
            
            # Convert to RGB if needed
            if image.mode != "RGB":
                image = image.convert("RGB")
            
            # Resize image
            image = image.resize(target_size)
            
            # Extract image features (this would depend on the specific model requirements)
            # For this example, we'll just add some basic image statistics
            img_array = np.array(image)
            processed_data["image_mean_r"] = np.mean(img_array[:,:,0])
            processed_data["image_mean_g"] = np.mean(img_array[:,:,1])
            processed_data["image_mean_b"] = np.mean(img_array[:,:,2])
        
        # Add additional features
        if features:
            processed_data.update(features)
        
        return processed_data

# Create instance
image_processor = ImageProcessor()