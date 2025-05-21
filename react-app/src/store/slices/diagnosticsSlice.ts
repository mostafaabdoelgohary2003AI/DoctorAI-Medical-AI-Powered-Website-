import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  predictBoneFracture,
  predictLungColon,
  predictMonkeypox,
  predictSkinCancer,
  predictTumor,
  predictXray,
  predictPalmDisease,
  predictChatbot
} from '../../services/api';

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
  selectedImage: { file: File; url: string } | null;
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

// Placeholder mappings for severity, description, and recommendations
const getResultDetails = (condition: string, confidence: number, language: 'en' | 'ar' = 'en') => {
  const severityMap: { [key: string]: 'low' | 'medium' | 'high' } = {
    // Palm
    'Healthy': 'low',
    'Fusarium Wilt': 'high',
    'Leaf Spot': 'medium',
    // Bone Fracture
    'Fractured': 'high',
    'Not Fractured': 'low',
    // Lung & Colon
    'Colon Adenocarcinoma': 'high',
    'Lung Adenocarcinoma': 'high',
    'Lung Squamous Cell Carcinoma': 'high',
    'Colon Benign Tissue': 'low',
    'Lung Benign Tissue': 'low',
    // Monkeypox
    'Monkeypox': 'high',
    'Non-Monkeypox': 'low',
    // Skin Cancer
    'melanoma': 'high',
    'basal cell carcinoma': 'high',
    'Actinic keratoses and intraepithelial carcinomae': 'high',
    'melanocytic nevi': 'low',
    'benign keratosis-like lesions': 'medium',
    'pyogenic granulomas and hemorrhage': 'medium',
    'dermatofibroma': 'low',
    // Tumor
    'Pituitary': 'high',
    'meninigioma': 'high',
    'glioma': 'high',
    'notumor': 'low',
    // X-ray
    'pneumonia': 'high',
    'normal': 'low',
  };

  const descriptionMap: { [key: string]: string } = {
    // Palm
    'Healthy': language === 'en' ? 'No disease detected.' : 'لم يتم اكتشاف مرض.',
    'Fusarium Wilt': language === 'en' ? 'Fusarium wilt detected.' : 'تم اكتشاف ذبول الفيوزاريوم.',
    'Leaf Spot': language === 'en' ? 'Leaf spot disease detected.' : 'تم اكتشاف مرض بقع الأوراق.',

    // Bone Fracture
    'Fractured': language === 'en' ? 'A fracture was detected in the bone.' : 'تم اكتشاف كسر في العظم.',
    'Not Fractured': language === 'en' ? 'No fracture detected.' : 'لم يتم اكتشاف كسر.',
    // Lung & Colon
    'Colon Adenocarcinoma': language === 'en' ? 'Malignant tumor detected in colon tissue.' : 'تم اكتشاف ورم خبيث في نسيج القولون.',
    'Lung Adenocarcinoma': language === 'en' ? 'Malignant tumor detected in lung tissue.' : 'تم اكتشاف ورم خبيث في نسيج الرئة.',
    'Lung Squamous Cell Carcinoma': language === 'en' ? 'Squamous cell carcinoma detected in lung tissue.' : 'تم اكتشاف سرطان الخلايا الحرشفية في نسيج الرئة.',
    'Colon Benign Tissue': language === 'en' ? 'No malignancy detected in colon tissue.' : 'لم يتم اكتشاف أي ورم خبيث في نسيج القولون.',
    'Lung Benign Tissue': language === 'en' ? 'No malignancy detected in lung tissue.' : 'لم يتم اكتشاف أي ورم خبيث في نسيج الرئة.',
    // Monkeypox
    'Monkeypox': language === 'en' ? 'Monkeypox infection detected.' : 'تم اكتشاف عدوى جدري القرود.',
    'Non-Monkeypox': language === 'en' ? 'No monkeypox infection detected.' : 'لم يتم اكتشاف عدوى جدري القرود.',
    // Skin Cancer
    'melanoma': language === 'en' ? 'Melanoma detected in skin tissue.' : 'تم اكتشاف ميلانوما في نسيج الجلد.',
    'basal cell carcinoma': language === 'en' ? 'Basal cell carcinoma detected.' : 'تم اكتشاف سرطان الخلايا القاعدية.',
    'Actinic keratoses and intraepithelial carcinomae': language === 'en' ? 'Precancerous lesions detected.' : 'تم اكتشاف آفات سرطانية محتملة.',
    'melanocytic nevi': language === 'en' ? 'Benign melanocytic nevi detected.' : 'تم اكتشاف وحمات ميلانوسيتية حميدة.',
    'benign keratosis-like lesions': language === 'en' ? 'Benign keratosis-like lesions detected.' : 'تم اكتشاف آفات شبيهة بالتقرن الحميد.',
    'pyogenic granulomas and hemorrhage': language === 'en' ? 'Pyogenic granulomas or hemorrhage detected.' : 'تم اكتشاف أورام حبيبية قيحية أو نزيف.',
    'dermatofibroma': language === 'en' ? 'Benign dermatofibroma detected.' : 'تم اكتشاف ورم ليفي جلدي حميد.',
    // Tumor
    'Pituitary': language === 'en' ? 'Pituitary tumor detected.' : 'تم اكتشاف ورم الغدة النخامية.',
    'meninigioma': language === 'en' ? 'Meningioma tumor detected.' : 'تم اكتشاف ورم السحايا.',
    'glioma': language === 'en' ? 'Glioma tumor detected.' : 'تم اكتشاف ورم دبقي.',
    'notumor': language === 'en' ? 'No tumor detected.' : 'لم يتم اكتشاف ورم.',
    // X-ray
    'pneumonia': language === 'en' ? 'Pneumonia detected in chest X-ray.' : 'تم اكتشاف الالتهاب الرئوي في أشعة الصدر.',
    'normal': language === 'en' ? 'No abnormalities detected in chest X-ray.' : 'لم يتم اكتشاف أي تشوهات في أشعة الصدر.',
  };

  const recommendationsMap: { [key: string]: string[] } = {
    // Palm
    'Healthy': [language === 'en' ? 'Maintain current care.' : 'واصل الرعاية الحالية.'],
    'Fusarium Wilt': [
      language === 'en' ? 'Consult an agricultural specialist.' : 'استشر أخصائي زراعي.',
      language === 'en' ? 'Remove affected plants.' : 'إزالة النباتات المصابة.',
    ],
    'Leaf Spot': [
      language === 'en' ? 'Apply fungicide as recommended.' : 'استخدم مبيد فطري حسب التوصيات.',
    ],

    // Bone Fracture
    'Fractured': [
      language === 'en' ? 'Consult an orthopedic specialist immediately.' : 'استشر أخصائي عظام فورًا.',
      language === 'en' ? 'Avoid putting weight on the affected area.' : 'تجنب وضع وزن على المنطقة المصابة.',
    ],
    'Not Fractured': [
      language === 'en' ? 'Monitor for any pain or swelling.' : 'راقب أي ألم أو تورم.',
    ],
    // Lung & Colon
    'Colon Adenocarcinoma': [
      language === 'en' ? 'Consult an oncologist immediately.' : 'استشر أخصائي الأورام فورًا.',
      language === 'en' ? 'Consider biopsy and staging tests.' : 'فكر في إجراء خزعة واختبارات التدريج.',
    ],
    'Lung Adenocarcinoma': [
      language === 'en' ? 'Consult an oncologist immediately.' : 'استشر أخصائي الأورام فورًا.',
      language === 'en' ? 'Consider biopsy and staging tests.' : 'فكر في إجراء خزعة واختبارات التدريج.',
    ],
    'Lung Squamous Cell Carcinoma': [
      language === 'en' ? 'Consult an oncologist immediately.' : 'استشر أخصائي الأورام فورًا.',
      language === 'en' ? 'Consider biopsy and staging tests.' : 'فكر في إجراء خزعة واختبارات التدريج.',
    ],
    'Colon Benign Tissue': [
      language === 'en' ? 'Follow up with a gastroenterologist.' : 'تابع مع أخصائي الجهاز الهضمي.',
    ],
    'Lung Benign Tissue': [
      language === 'en' ? 'Follow up with a pulmonologist.' : 'تابع مع أخصائي الرئة.',
    ],
    // Monkeypox
    'Monkeypox': [
      language === 'en' ? 'Consult an infectious disease specialist.' : 'استشر أخصائي الأمراض المعدية.',
      language === 'en' ? 'Isolate to prevent transmission.' : 'اعزل لمنع انتقال العدوى.',
    ],
    'Non-Monkeypox': [
      language === 'en' ? 'Monitor for symptoms for 21 days.' : 'راقب الأعراض لمدة 21 يومًا.',
    ],
    // Skin Cancer
    'melanoma': [
      language === 'en' ? 'Consult a dermatologist or oncologist immediately.' : 'استشر أخصائي الأمراض الجلدية أو الأورام فورًا.',
      language === 'en' ? 'Consider biopsy and further testing.' : 'فكر في إجراء خزعة واختبارات إضافية.',
    ],
    'basal cell carcinoma': [
      language === 'en' ? 'Consult a dermatologist immediately.' : 'استشر أخصائي الأمراض الجلدية فورًا.',
      language === 'en' ? 'Consider surgical removal.' : 'فكر في الإزالة الجراحية.',
    ],
    'Actinic keratoses and intraepithelial carcinomae': [
      language === 'en' ? 'Consult a dermatologist for treatment options.' : 'استشر أخصائي الأمراض الجلدية لخيارات العلاج.',
    ],
    'melanocytic nevi': [
      language === 'en' ? 'Monitor for changes in size or color.' : 'راقب التغيرات في الحجم أو اللون.',
    ],
    'benign keratosis-like lesions': [
      language === 'en' ? 'Consult a dermatologist for evaluation.' : 'استشر أخصائي الأمراض الجلدية للتقييم.',
    ],
    'pyogenic granulomas and hemorrhage': [
      language === 'en' ? 'Consult a dermatologist for treatment.' : 'استشر أخصائي الأمراض الجلدية للعلاج.',
    ],
    'dermatofibroma': [
      language === 'en' ? 'Monitor for changes or consult a dermatologist.' : 'راقب التغيرات أو استشر أخصائي الأمراض الجلدية.',
    ],
    // Tumor
    'Pituitary': [
      language === 'en' ? 'Consult a neurosurgeon or endocrinologist.' : 'استشر جراح الأعصاب أو أخصائي الغدد الصماء.',
      language === 'en' ? 'Consider MRI and hormone testing.' : 'فكر في إجراء تصوير بالرنين المغناطيسي واختبارات الهرمونات.',
    ],
    'meninigioma': [
      language === 'en' ? 'Consult a neurosurgeon immediately.' : 'استشر جراح الأعصاب فورًا.',
      language === 'en' ? 'Consider surgical evaluation.' : 'فكر في التقييم الجراحي.',
    ],
    'glioma': [
      language === 'en' ? 'Consult a neurosurgeon or oncologist immediately.' : 'استشر جراح الأعصاب أو أخصائي الأورام فورًا.',
      language === 'en' ? 'Consider biopsy and imaging.' : 'فكر في إجراء خزعة وتصوير.',
    ],
    'notumor': [
      language === 'en' ? 'Follow up with a neurologist.' : 'تابع مع أخصائي الأعصاب.',
    ],
    // X-ray
    'pneumonia': [
      language === 'en' ? 'Consult a pulmonologist immediately.' : 'استشر أخصائي الرئة فورًا.',
      language === 'en' ? 'Consider antibiotics and follow-up imaging.' : 'فكر في المضادات الحيوية وصور المتابعة.',
    ],
    'normal': [
      language === 'en' ? 'Monitor for respiratory symptoms.' : 'راقب أعراض الجهاز التنفسي.',
    ],
  };

  return {
    severity: severityMap[condition] || 'medium',
    description: descriptionMap[condition] || (language === 'en' ? 'Analysis complete.' : 'اكتمل التحليل.'),
    recommendations: recommendationsMap[condition] || [
      language === 'en' ? 'Consult a healthcare professional for detailed diagnosis.' : 'استشر أخصائي رعاية صحية لتشخيص مفصل.',
    ],
  };
};

export const analyzeImage = createAsyncThunk(
  'diagnostics/analyzeImage',
  async ({ file, model }: { file: File; model: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { ui: { language: 'en' | 'ar' } };
      const language = state.ui.language;
      let response;
      switch (model) {
        case 'bone_fracture':
          response = await predictBoneFracture(file);
          break;
        case 'lung_colon':
          response = await predictLungColon(file);
          break;
        case 'monkeypox':
          response = await predictMonkeypox(file);
          break;
        case 'skin_cancer':
          response = await predictSkinCancer(file);
          break;
        case 'tumor':
          response = await predictTumor(file);
          break;
        case 'xray':
          response = await predictXray(file);
          break;
        default:
          throw new Error('Invalid model selected');
      }
      const { condition, confidence } = response;
      const { severity, description, recommendations } = getResultDetails(condition, confidence, language);

      const result: DiagnosticResult = {
        id: Date.now().toString(),
        diagnosisType: 'imaging',
        result: {
          condition,
          confidence,
          description,
          recommendations,
          severity,
        },
        timestamp: new Date().toISOString(),
        imageUrl: URL.createObjectURL(file),
      };

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Image analysis failed');
    }
  }
);

export const analyzePalmDisease = createAsyncThunk(
  'diagnostics/analyzePalmDisease',
  async (features: number[], { rejectWithValue, getState }) => {
    try {
      const state = getState() as { ui: { language: 'en' | 'ar' } };
      const language = state.ui.language;
      const response = await predictPalmDisease(features);
      const { condition, confidence } = response;
      const { severity, description, recommendations } = getResultDetails(condition, confidence, language);

      const result: DiagnosticResult = {
        id: Date.now().toString(),
        diagnosisType: 'symptoms',
        result: {
          condition,
          confidence,
          severity,
          description,
          recommendations,
        },
        timestamp: new Date().toISOString(),
        symptoms: features.map(f => f.toString()),
      };

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Palm disease analysis failed');
    }
  }
);

// Chatbot:
export const analyzeChatbot = createAsyncThunk(
  'diagnostics/analyzeChatbot',
  async (message: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { ui: { language: 'en' | 'ar' } };
      const language = state.ui.language;
      const response = await predictChatbot(message); // Updated to pass string directly
      const result: DiagnosticResult = {
        id: Date.now().toString(),
        diagnosisType: 'chat',
        result: {
          condition: response.response,
          confidence: 1.0, // Chatbot may not provide confidence
          severity: 'low',
          description: language === 'en' ? 'Chatbot response based on your input.' : 'رد الدردشة بناءً على مدخلاتك.',
          recommendations: [language === 'en' ? 'Consult a professional if needed.' : 'استشر مختصًا إذا لزم الأمر.'],
        },
        timestamp: new Date().toISOString(),
      };
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Chatbot analysis failed');
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
    setSelectedImage: (state, action: PayloadAction<{ file: File; url: string } | null>) => {
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
    // Chatbot:
      builder
    .addCase(analyzeChatbot.pending, (state) => {
      state.isAnalyzing = true;
      state.error = null;
    })
    .addCase(analyzeChatbot.fulfilled, (state, action) => {
      state.isAnalyzing = false;
      state.results.unshift(action.payload);
      state.currentResult = action.payload;
    })
    .addCase(analyzeChatbot.rejected, (state, action) => {
      state.isAnalyzing = false;
      state.error = action.payload as string;
    });

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
    builder
  .addCase(analyzePalmDisease.pending, (state) => {
    state.isAnalyzing = true;
    state.error = null;
  })
  .addCase(analyzePalmDisease.fulfilled, (state, action) => {
    state.isAnalyzing = false;
    state.results.unshift(action.payload);
    state.currentResult = action.payload;
  })
  .addCase(analyzePalmDisease.rejected, (state, action) => {
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