import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { AppDispatch } from '../store';
import { addSymptom, removeSymptom, clearSymptoms, analyzePalmDisease, analyzeSymptoms } from '../store/slices/diagnosticsSlice';
import { AlertTriangle, Search, Plus, X } from 'lucide-react';

// Common symptoms for the symptom selector
const commonSymptoms = [
  { id: 'headache', en: 'Headache', ar: 'صداع' },
  { id: 'fever', en: 'Fever', ar: 'حمى' },
  { id: 'cough', en: 'Cough', ar: 'سعال' },
  { id: 'fatigue', en: 'Fatigue', ar: 'إرهاق' },
  { id: 'chestPain', en: 'Chest Pain', ar: 'ألم في الصدر' },
  { id: 'shortnessOfBreath', en: 'Shortness of Breath', ar: 'ضيق في التنفس' },
  { id: 'nauseaVomiting', en: 'Nausea/Vomiting', ar: 'غثيان/قيء' },
  { id: 'abdominalPain', en: 'Abdominal Pain', ar: 'ألم في البطن' },
  { id: 'diarrhea', en: 'Diarrhea', ar: 'إسهال' },
  { id: 'rash', en: 'Rash', ar: 'طفح جلدي' },
  { id: 'jointPain', en: 'Joint Pain', ar: 'ألم في المفاصل' },
  { id: 'dizziness', en: 'Dizziness', ar: 'دوار' },
  { id: 'soreThroat', en: 'Sore Throat', ar: 'التهاب الحلق' },
  { id: 'difficultySwallowing', en: 'Difficulty Swallowing', ar: 'صعوبة في البلع' },
  { id: 'earPain', en: 'Ear Pain', ar: 'ألم في الأذن' },
  { id: 'lossOfAppetite', en: 'Loss of Appetite', ar: 'فقدان الشهية' },
  { id: 'muscleAches', en: 'Muscle Aches', ar: 'آلام عضلية' },
  { id: 'stiffNeck', en: 'Stiff Neck', ar: 'تيبس الرقبة' },
  { id: 'blurredVision', en: 'Blurred Vision', ar: 'عدم وضوح الرؤية' },
  { id: 'constipation', en: 'Constipation', ar: 'إمساك' },
];

// Features for palm disease model (adjust based on ml_balanced_palm.ipynb)
const palmFeatures = [
  { id: 'leaf_discoloration', en: 'Leaf Discoloration (0-10)', ar: 'تغير لون الأوراق (0-10)' },
  { id: 'spot_density', en: 'Spot Density (0-10)', ar: 'كثافة البقع (0-10)' },
  { id: 'wilting_severity', en: 'Wilting Severity (0-10)', ar: 'شدة الذبول (0-10)' },
  { id: 'growth_stunting', en: 'Growth Stunting (0-10)', ar: 'توقف النمو (0-10)' },
  { id: 'lesion_size', en: 'Lesion Size (0-10)', ar: 'حجم الآفات (0-10)' },
];

const SymptomChecker: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { language } = useSelector((state: RootState) => state.ui);
  const { selectedSymptoms, isAnalyzing, currentResult, error } = useSelector(
    (state: RootState) => state.diagnostics
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [palmFeatureValues, setPalmFeatureValues] = useState<{ [key: string]: number }>(
    palmFeatures.reduce((acc, feature) => ({ ...acc, [feature.id]: 0 }), {})
  );

  const bodyParts = [
    { id: 'head', en: 'Head', ar: 'الرأس' },
    { id: 'chest', en: 'Chest', ar: 'الصدر' },
    { id: 'abdomen', en: 'Abdomen', ar: 'البطن' },
    { id: 'limbs', en: 'Arms & Legs', ar: 'الذراعين والساقين' },
    { id: 'skin', en: 'Skin', ar: 'الجلد' },
    { id: 'general', en: 'General', ar: 'عام' },
    { id: 'palm', en: 'Palm Plant', ar: 'نبات النخيل' },
  ];

  // Filter symptoms based on search term and body part
  const filteredSymptoms = commonSymptoms.filter((symptom) => {
    const matchesSearch = symptom[language === 'en' ? 'en' : 'ar']
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (!selectedBodyPart || searchTerm || selectedBodyPart === 'palm') {
      return matchesSearch;
    }

    switch (selectedBodyPart) {
      case 'head':
        return ['headache', 'dizziness', 'blurredVision', 'earPain', 'soreThroat'].includes(
          symptom.id
        ) && matchesSearch;
      case 'chest':
        return ['chestPain', 'cough', 'shortnessOfBreath'].includes(symptom.id) && matchesSearch;
      case 'abdomen':
        return ['abdominalPain', 'nauseaVomiting', 'diarrhea', 'constipation', 'lossOfAppetite'].includes(
          symptom.id
        ) && matchesSearch;
      case 'limbs':
        return ['jointPain', 'muscleAches'].includes(symptom.id) && matchesSearch;
      case 'skin':
        return ['rash'].includes(symptom.id) && matchesSearch;
      case 'general':
        return ['fever', 'fatigue'].includes(symptom.id) && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const handleAddSymptom = (symptomId: string) => {
    dispatch(addSymptom(symptomId));
  };

  const handleRemoveSymptom = (symptomId: string) => {
    dispatch(removeSymptom(symptomId));
  };

  const handleClearSymptoms = () => {
    dispatch(clearSymptoms());
    setPalmFeatureValues(palmFeatures.reduce((acc, feature) => ({ ...acc, [feature.id]: 0 }), {}));
  };

  const handleFeatureChange = (featureId: string, value: number) => {
    setPalmFeatureValues((prev) => ({ ...prev, [featureId]: value }));
  };

  const handleAnalyzeSymptoms = () => {
    if (selectedBodyPart === 'palm') {
      const features = palmFeatures.map((feature) => palmFeatureValues[feature.id]);
      if (features.some((value) => value < 0 || value > 10)) {
        alert(language === 'en' ? 'Feature values must be between 0 and 10' : 'يجب أن تكون قيم الميزات بين 0 و10');
        return;
      }
      dispatch(analyzePalmDisease(features));
    } else if (selectedSymptoms.length > 0) {
      dispatch(analyzeSymptoms(selectedSymptoms));
    }
  };

  const getSymptomName = (symptomId: string) => {
    const symptom = commonSymptoms.find((s) => s.id === symptomId);
    return symptom ? symptom[language === 'en' ? 'en' : 'ar'] : symptomId;
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {language === 'en' ? 'Symptom Checker' : 'فاحص الأعراض'}
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
          {language === 'en'
            ? 'Select your symptoms or input palm disease features for a preliminary assessment.'
            : 'حدد أعراضك أو أدخل ميزات مرض النخيل للحصول على تقييم أولي.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold">
                {language === 'en' ? 'Select Body Region' : 'حدد منطقة الجسم'}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {bodyParts.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => setSelectedBodyPart(part.id === selectedBodyPart ? null : part.id)}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      selectedBodyPart === part.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                    }`}
                  >
                    {part[language === 'en' ? 'en' : 'ar']}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedBodyPart === 'palm' ? (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold">
                  {language === 'en' ? 'Palm Disease Features' : 'ميزات مرض النخيل'}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {palmFeatures.map((feature) => (
                    <div key={feature.id} className="flex flex-col">
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
                        {feature[language === 'en' ? 'en' : 'ar']}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={palmFeatureValues[feature.id]}
                        onChange={(e) => handleFeatureChange(feature.id, parseFloat(e.target.value) || 0)}
                        className="form-input"
                        placeholder={language === 'en' ? 'Enter value (0-10)' : 'أدخل القيمة (0-10)'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold">
                  {language === 'en' ? 'Select Symptoms' : 'حدد الأعراض'}
                </h3>
              </div>
              <div className="p-6">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    className="form-input pl-10"
                    placeholder={
                      language === 'en' ? 'Search symptoms...' : 'البحث عن الأعراض...'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-2">
                    {filteredSymptoms.map((symptom) => (
                      <button
                        key={symptom.id}
                        onClick={() => handleAddSymptom(symptom.id)}
                        disabled={selectedSymptoms.includes(symptom.id)}
                        className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
                          selectedSymptoms.includes(symptom.id)
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 cursor-not-allowed'
                            : 'bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                        }`}
                      >
                        <span>{symptom[language === 'en' ? 'en' : 'ar']}</span>
                        <Plus
                          className={`w-4 h-4 ${
                            selectedSymptoms.includes(symptom.id)
                              ? 'text-primary-500'
                              : 'text-neutral-500 dark:text-neutral-400'
                          }`}
                        />
                      </button>
                    ))}

                    {filteredSymptoms.length === 0 && (
                      <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">
                        {language === 'en'
                          ? 'No symptoms found. Try a different search term.'
                          : 'لم يتم العثور على أعراض. جرب مصطلح بحث مختلف.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
              <h3 className="font-semibold">
                {language === 'en' ? 'Selected Symptoms/Features' : 'الأعراض/الميزات المحددة'}
              </h3>
              {(selectedSymptoms.length > 0 || selectedBodyPart === 'palm') && (
                <button
                  onClick={handleClearSymptoms}
                  className="text-sm text-neutral-500 hover:text-error-500 dark:text-neutral-400 dark:hover:text-error-400"
                >
                  {language === 'en' ? 'Clear all' : 'مسح الكل'}
                </button>
              )}
            </div>
            <div className="p-6">
              {selectedBodyPart === 'palm' ? (
                <div className="space-y-2">
                  {palmFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-full"
                    >
                      <span className="text-sm">
                        {feature[language === 'en' ? 'en' : 'ar']}: {palmFeatureValues[feature.id]}
                      </span>
                    </div>
                  ))}
                </div>
              ) : selectedSymptoms.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((symptomId) => (
                    <div
                      key={symptomId}
                      className="flex items-center bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-full"
                    >
                      <span className="text-sm">{getSymptomName(symptomId)}</span>
                      <button
                        onClick={() => handleRemoveSymptom(symptomId)}
                        className="ml-2 text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">
                  {language === 'en'
                    ? 'No symptoms or features selected. Please select from above.'
                    : 'لم يتم تحديد أعراض أو ميزات. يرجى التحديد من الأعلى.'}
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={handleAnalyzeSymptoms}
                disabled={
                  (selectedBodyPart === 'palm' && palmFeatures.every((f) => palmFeatureValues[f.id] === 0)) ||
                  (selectedBodyPart !== 'palm' && selectedSymptoms.length === 0) ||
                  isAnalyzing
                }
                className={`btn w-full ${
                  (selectedBodyPart === 'palm' && palmFeatures.every((f) => palmFeatureValues[f.id] === 0)) ||
                  (selectedBodyPart !== 'palm' && selectedSymptoms.length === 0) ||
                  isAnalyzing
                    ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {language === 'en' ? 'Analyzing...' : 'جاري التحليل...'}
                  </>
                ) : (
                  language === 'en' ? 'Analyze' : 'تحليل'
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          {currentResult && currentResult.diagnosisType === 'symptoms' && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold">
                  {language === 'en' ? 'Analysis Results' : 'نتائج التحليل'}
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-3 h-3 rounded-full mr-2 
                    ${currentResult.result.severity === 'high' ? 'bg-error-500' : 
                      currentResult.result.severity === 'medium' ? 'bg-warning-500' : 'bg-success-500'}`}
                  ></div>
                  <h4 className="text-xl font-semibold">
                    {currentResult.result.condition}
                  </h4>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                      {language === 'en' ? 'Confidence' : 'الثقة'}
                    </span>
                    <span className="text-sm font-medium">
                      {(currentResult.result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${currentResult.result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-medium mb-2">
                    {language === 'en' ? 'Reported Symptoms/Features' : 'الأعراض/الميزات المبلغ عنها'}
                  </h5>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentResult.symptoms?.map((symptomId, index) => (
                      <div
                        key={index}
                        className="bg-neutral-100 dark:bg-neutral-700 px-3 py-1 rounded-full text-sm text-neutral-700 dark:text-neutral-300"
                      >
                        {selectedBodyPart === 'palm'
                          ? `${palmFeatures[index][language === 'en' ? 'en' : 'ar']}: ${symptomId}`
                          : getSymptomName(symptomId)}
                      </div>
                    ))}
                  </div>

                  <h5 className="font-medium mb-2">
                    {language === 'en' ? 'Description' : 'الوصف'}
                  </h5>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    {currentResult.result.description}
                  </p>
                </div>

                <div>
                  <h5 className="font-medium mb-2">
                    {language === 'en' ? 'Recommendations' : 'التوصيات'}
                  </h5>
                  <ul className="space-y-2">
                    {currentResult.result.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mt-0.5">
                          <span className="text-xs font-bold text-primary-500">{index + 1}</span>
                        </div>
                        <span className="ml-2 text-neutral-600 dark:text-neutral-300">
                          {recommendation}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg">
                  <p>
                    {language === 'en'
                      ? 'Note: This assessment is for informational purposes only and should not replace professional medical or agricultural advice.'
                      : 'ملاحظة: هذا التقييم لأغراض إعلامية فقط ولا ينبغي أن يحل محل المشورة الطبية أو الزراعية المهنية.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-xl p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-error-500 mr-2" />
                <p className="text-error-700 dark:text-error-200 font-medium">
                  {language === 'en' ? 'Analysis Error' : 'خطأ في التحليل'}
                </p>
              </div>
              <p className="mt-2 text-error-600 dark:text-error-300">
                {error}
              </p>
            </div>
          )}

          {!currentResult && !error && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden h-full">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold">
                  {language === 'en' ? 'How It Works' : 'كيف يعمل'}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mt-0.5">
                      <span className="text-lg font-bold text-primary-500">1</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-neutral-800 dark:text-white">
                        {language === 'en' ? 'Select Body Region or Palm' : 'اختر منطقة الجسم أو النخيل'}
                      </h4>
                      <p className="text-neutral-600 dark:text-neutral-300 mt-1">
                        {language === 'en'
                          ? 'Choose the body region or palm plant for your symptoms or features.'
                          : 'اختر منطقة الجسم أو نبات النخيل لأعراضك أو ميزاتك.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mt-0.5">
                      <span className="text-lg font-bold text-primary-500">2</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-neutral-800 dark:text-white">
                        {language === 'en' ? 'Choose Symptoms or Features' : 'اختر الأعراض أو الميزات'}
                      </h4>
                      <p className="text-neutral-600 dark:text-neutral-300 mt-1">
                        {language === 'en'
                          ? 'Select symptoms or input palm disease features.'
                          : 'حدد الأعراض أو أدخل ميزات مرض النخيل.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mt-0.5">
                      <span className="text-lg font-bold text-primary-500">3</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-neutral-800 dark:text-white">
                        {language === 'en' ? 'Get Analysis' : 'احصل على التحليل'}
                      </h4>
                      <p className="text-neutral-600 dark:text-neutral-300 mt-1">
                        {language === 'en'
                          ? 'Our AI analyzes your input and provides potential conditions.'
                          : 'يقوم الذكاء الاصطناعي بتحليل مدخلاتك وتقديم الحالات المحتملة.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mt-0.5">
                      <span className="text-lg font-bold text-primary-500">4</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-neutral-800 dark:text-white">
                        {language === 'en' ? 'Next Steps' : 'الخطوات التالية'}
                      </h4>
                      <p className="text-neutral-600 dark:text-neutral-300 mt-1">
                        {language === 'en'
                          ? 'Receive recommendations for medical or agricultural care.'
                          : 'احصل على توصيات للرعاية الطبية أو الزراعية.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                    {language === 'en'
                      ? 'Remember: This tool is for informational purposes only and does not replace professional medical or agricultural advice.'
                      : 'تذكر: هذه الأداة لأغراض إعلامية فقط ولا تحل محل المشورة الطبية أو الزراعية المهنية.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;