# Model Loading Guide for Medical AI Diagnostics System

This guide explains how models are loaded and managed in the Medical AI Diagnostics System after reorganization.

## Model Directory Structure

After reorganization, models are stored in a dedicated `/models` directory with the following structure:

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

## Model Registry

The system uses a `ModelRegistry` class to manage model loading and caching. This class is implemented in `/server/utils/model_loader.py`.

### Key Features

1. **LRU Caching**: Only keeps the most recently used models in memory
2. **Lazy Loading**: Models are loaded only when needed
3. **Metadata Management**: Model information is stored in JSON files
4. **Performance Monitoring**: Tracks inference time and memory usage

## How Models Are Loaded

### TensorFlow Models (.h5, .keras)

TensorFlow models are loaded using the `tf.keras.models.load_model()` function:

```python
model = tf.keras.models.load_model(model_path)
```

### XGBoost Models (.pkl)

XGBoost models are loaded using pickle:

```python
with open(model_path, 'rb') as f:
    model = pickle.load(f)
```

## Model Initialization

Models can be pre-loaded into the cache during application startup using the `model_init.py` script:

```bash
python -m server.core.model_init
```

This script:
1. Configures GPU settings if available
2. Initializes the model registry with the specified cache size
3. Pre-loads high-priority models into the cache

## Model Paths Configuration

Model paths are configured in the `config.py` file:

```python
# Before reorganization
SKIN_CANCER_MODEL_PATH = "DEPI_SKIN_CANCER_MODEL.h5"

# After reorganization
SKIN_CANCER_MODEL_PATH = "models/skin_cancer/DEPI_SKIN_CANCER_MODEL.h5"
```

## Docker Volume Mounting

In the Docker setup, models are mounted as volumes:

```yaml
volumes:
  - ./models:/app/models
```

This allows models to be updated without rebuilding the Docker image.

## Model Versioning

The system supports model versioning through the model registry metadata:

```
/server/model_registry/
├── bone_fracture/
│   └── v1/
│       └── metadata.json
├── monkeypox/
│   └── v1/
│       └── metadata.json
...
```

Each `metadata.json` file contains information about the model version, including:
- Model name
- Version number
- Creation date
- Input/output specifications
- Performance metrics

## Updating Models

To update a model:

1. Add the new model file to the appropriate directory under `/models`
2. Create a new version directory in the model registry (e.g., `v2`)
3. Add a new metadata.json file with updated information
4. Update the model path in `config.py` if necessary

## Memory Management

The LRU cache size can be configured using the `MODEL_CACHE_SIZE` environment variable. The default value is 5, which means only the 5 most recently used models will be kept in memory.

For systems with limited memory, consider reducing this value. For systems with more memory, you can increase it to improve performance.

## GPU Acceleration

The system automatically uses GPU acceleration if available. The following environment variables control GPU behavior:

```
TF_FORCE_GPU_ALLOW_GROWTH=true
TF_CPP_MIN_LOG_LEVEL=2
```

## Troubleshooting

### Common Issues

1. **Model Not Found**:
   - Check that the model file exists in the correct location
   - Verify the path in `config.py`

2. **Memory Errors**:
   - Reduce the `MODEL_CACHE_SIZE`
   - Check for memory leaks
   - Consider using smaller models

3. **GPU Issues**:
   - Verify CUDA and cuDNN installation
   - Check GPU compatibility with TensorFlow
   - Monitor GPU memory usage

### Debugging

Enable debug logging to get more information about model loading:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Performance Optimization

1. **Model Quantization**:
   - Consider using quantized models for faster inference
   - TensorFlow Lite can be used for model optimization

2. **Batch Processing**:
   - Process multiple inputs in a single batch for better throughput

3. **TensorRT Conversion**:
   - For NVIDIA GPUs, consider converting models to TensorRT format

## Conclusion

Proper model management is crucial for the performance and reliability of the Medical AI Diagnostics System. By following this guide, you can ensure that models are loaded efficiently and managed effectively in the reorganized project structure.