import pytest
import base64
from fastapi.testclient import TestClient
from main import app

# Create test client
client = TestClient(app)

# Test chatbot text message endpoint
def test_chatbot_text_message():
    # Test data
    test_data = {
        "message": "I have a headache, what should I do?",
        "message_type": "text",
        "conversation_history": []
    }
    
    # Make request
    response = client.post("/api/chatbot/message", json=test_data)
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert "model_version" in data
    assert "processing_time" in data
    assert isinstance(data["response"], str)
    assert len(data["response"]) > 0

# Test chatbot with image message
def test_chatbot_image_message():
    # Load a sample image for testing
    with open("tests/test_data/sample_image.jpg", "rb") as image_file:
        image_data = base64.b64encode(image_file.read()).decode("utf-8")
    
    # Test data
    test_data = {
        "message": "What can you tell me about this medical image?",
        "message_type": "image",
        "image_data": f"data:image/jpeg;base64,{image_data}",
        "conversation_history": []
    }
    
    # Make request
    response = client.post("/api/chatbot/message", json=test_data)
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert "model_version" in data
    assert "processing_time" in data
    assert isinstance(data["response"], str)
    assert "analyzed your medical image" in data["response"]

# Test chatbot metadata endpoint
def test_chatbot_metadata():
    # Make request
    response = client.get("/api/chatbot/metadata")
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert "model_version" in data
    assert "model_file" in data
    assert "capabilities" in data
    assert "limitations" in data
    assert "confidence_threshold" in data
    assert "max_sequence_length" in data