import * as tf from '@tensorflow/tfjs';
import * as ort from 'onnxruntime-web';

class ModelService {
  private imageModel: tf.LayersModel | null = null;
  private symptomModel: tf.LayersModel | null = null;
  private chatModel: ort.InferenceSession | null = null;

  async loadModels() {
    try {
      // Load image analysis model
      this.imageModel = await tf.loadLayersModel('/models/image-model/model.json');
      
      // Load symptom analysis model
      this.symptomModel = await tf.loadLayersModel('/models/symptom-model/model.json');
      
      // Load chat model
      this.chatModel = await ort.InferenceSession.create('/models/chat-model/model.onnx');
    } catch (error) {
      console.error('Error loading models:', error);
      throw new Error('Failed to load AI models');
    }
  }

  async analyzeImage(imageData: ImageData): Promise<{
    condition: string;
    confidence: number;
    description: string;
    recommendations: string[];
    severity: 'low' | 'medium' | 'high';
  }> {
    if (!this.imageModel) {
      throw new Error('Image model not loaded');
    }

    try {
      // Preprocess image
      const tensor = tf.browser.fromPixels(imageData)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();

      // Run inference
      const prediction = await this.imageModel.predict(tensor) as tf.Tensor;
      const results = await prediction.array();

      // Process results
      // This is a placeholder - actual processing would depend on your model
      return {
        condition: 'Sample Condition',
        confidence: 0.95,
        description: 'Sample description',
        recommendations: ['Sample recommendation'],
        severity: 'medium'
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image');
    }
  }

  async analyzeSymptoms(symptoms: string[]): Promise<{
    condition: string;
    confidence: number;
    description: string;
    recommendations: string[];
    severity: 'low' | 'medium' | 'high';
  }> {
    if (!this.symptomModel) {
      throw new Error('Symptom model not loaded');
    }

    try {
      // Convert symptoms to model input format
      // This is a placeholder - actual processing would depend on your model
      const input = tf.tensor2d([symptoms.map(s => 1)]);
      
      // Run inference
      const prediction = await this.symptomModel.predict(input) as tf.Tensor;
      const results = await prediction.array();

      return {
        condition: 'Sample Condition',
        confidence: 0.85,
        description: 'Sample description',
        recommendations: ['Sample recommendation'],
        severity: 'low'
      };
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      throw new Error('Failed to analyze symptoms');
    }
  }

  async generateChatResponse(message: string): Promise<string> {
    if (!this.chatModel) {
      throw new Error('Chat model not loaded');
    }

    try {
      // Prepare input for the model
      const inputTensor = new ort.Tensor('string', [message], [1]);
      
      // Run inference
      const results = await this.chatModel.run({ input: inputTensor });
      
      // Process results
      const response = results.output.data[0] as string;
      
      return response;
    } catch (error) {
      console.error('Error generating chat response:', error);
      throw new Error('Failed to generate response');
    }
  }
}

export const modelService = new ModelService();