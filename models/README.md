
# Model Files Directory

This directory contains the model files for the Medical AI Diagnostics System.

## Directory Structure

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

## Model Loading

Models are loaded using the ModelRegistry class in the server/utils/model_loader.py file.

## Adding New Models

To add a new model:

1. Create a new directory for the model type
2. Add the model file to the directory
3. Update the model registry metadata
4. Update the model loader to use the new model

## Troubleshooting

If you encounter issues with model loading, check the following:

1. Ensure the model file exists in the correct location
2. Verify the model path in config.py
3. Check the model registry metadata
4. Look for error messages in the logs
