import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface DiagnosticResult {
  id: string;
  diagnosisType: 'imaging' | 'symptoms' | 'chat';
  result: {
    condition: string;
    confidence: number;
    description: string;
    recommendations: string[];
    severity: 'low' | 'medium' | 'high';
  };
  timestamp: string;
  imageUrl?: string;
  symptoms?: string[];
}

interface DiagnosticsState {
  results: DiagnosticResult[];
  currentResult: DiagnosticResult | null;
  isAnalyzing: boolean;
  selectedImage: string | null;
  selectedSymptoms: string[];
  error: string | null;
}

const initialState: DiagnosticsState = {
  results: [],
  currentResult: null,
  isAnalyzing: false,
  selectedImage: null,
  selectedSymptoms: [],
  error: null,
};

// Mock image analysis for demo purposes
export const analyzeImage = createAsyncThunk(
  'diagnostics/analyzeImage',
  async (imageUrl: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result
      const result: DiagnosticResult = {
        id: Date.now().toString(),
        diagnosisType: 'imaging',
        result: {
          condition: 'Pneumonia',
          confidence: 0.87,
          description: 'The image analysis indicates signs of pneumonia in the right lower lobe.',
          recommendations: [
            'Consult with a pulmonologist',
            'Consider a follow-up CT scan',
            'Monitor for fever and respiratory symptoms'
          ],
          severity: 'medium',
        },
        timestamp: new Date().toISOString(),
        imageUrl,
      };
      
      return result;
    } catch (error) {
      return rejectWithValue('Image analysis failed');
    }
  }
);

// Mock symptom analysis for demo purposes
export const analyzeSymptoms = createAsyncThunk(
  'diagnostics/analyzeSymptoms',
  async (symptoms: string[], { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock result
      let result: DiagnosticResult;
      
      // Different mock results based on symptoms
      if (symptoms.includes('headache') && symptoms.includes('fever')) {
        result = {
          id: Date.now().toString(),
          diagnosisType: 'symptoms',
          result: {
            condition: 'Common cold',
            confidence: 0.75,
            description: 'Symptoms are consistent with a common cold or mild flu.',
            recommendations: [
              'Rest and hydration',
              'Over-the-counter pain relievers',
              'Monitor symptoms for 48 hours'
            ],
            severity: 'low',
          },
          timestamp: new Date().toISOString(),
          symptoms,
        };
      } else if (symptoms.includes('chest pain')) {
        result = {
          id: Date.now().toString(),
          diagnosisType: 'symptoms',
          result: {
            condition: 'Possible cardiovascular issue',
            confidence: 0.65,
            description: 'Chest pain may indicate several conditions. Immediate medical attention is recommended.',
            recommendations: [
              'Seek immediate medical attention',
              'ECG/EKG evaluation',
              'Cardiac enzyme tests'
            ],
            severity: 'high',
          },
          timestamp: new Date().toISOString(),
          symptoms,
        };
      } else {
        result = {
          id: Date.now().toString(),
          diagnosisType: 'symptoms',
          result: {
            condition: 'Non-specific symptoms',
            confidence: 0.60,
            description: 'The symptoms are non-specific and could indicate several minor conditions.',
            recommendations: [
              'Monitor symptoms for 48 hours',
              'Rest and hydration',
              'Consult a doctor if symptoms worsen'
            ],
            severity: 'low',
          },
          timestamp: new Date().toISOString(),
          symptoms,
        };
      }
      
      return result;
    } catch (error) {
      return rejectWithValue('Symptom analysis failed');
    }
  }
);

const diagnosticsSlice = createSlice({
  name: 'diagnostics',
  initialState,
  reducers: {
    setSelectedImage: (state, action: PayloadAction<string | null>) => {
      state.selectedImage = action.payload;
    },
    addSymptom: (state, action: PayloadAction<string>) => {
      if (!state.selectedSymptoms.includes(action.payload)) {
        state.selectedSymptoms.push(action.payload);
      }
    },
    removeSymptom: (state, action: PayloadAction<string>) => {
      state.selectedSymptoms = state.selectedSymptoms.filter(
        (symptom) => symptom !== action.payload
      );
    },
    clearSymptoms: (state) => {
      state.selectedSymptoms = [];
    },
    setCurrentResult: (state, action: PayloadAction<DiagnosticResult | null>) => {
      state.currentResult = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
      state.currentResult = null;
    },
  },
  extraReducers: (builder) => {
    // Image analysis
    builder.addCase(analyzeImage.pending, (state) => {
      state.isAnalyzing = true;
      state.error = null;
    });
    builder.addCase(analyzeImage.fulfilled, (state, action) => {
      state.isAnalyzing = false;
      state.results.unshift(action.payload);
      state.currentResult = action.payload;
    });
    builder.addCase(analyzeImage.rejected, (state, action) => {
      state.isAnalyzing = false;
      state.error = action.payload as string;
    });
    
    // Symptom analysis
    builder.addCase(analyzeSymptoms.pending, (state) => {
      state.isAnalyzing = true;
      state.error = null;
    });
    builder.addCase(analyzeSymptoms.fulfilled, (state, action) => {
      state.isAnalyzing = false;
      state.results.unshift(action.payload);
      state.currentResult = action.payload;
    });
    builder.addCase(analyzeSymptoms.rejected, (state, action) => {
      state.isAnalyzing = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setSelectedImage,
  addSymptom,
  removeSymptom,
  clearSymptoms,
  setCurrentResult,
  clearResults,
} = diagnosticsSlice.actions;

export default diagnosticsSlice.reducer;