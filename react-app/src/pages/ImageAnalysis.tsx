import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { RootState } from '../store';
import { analyzeImage, setSelectedImage } from '../store/slices/diagnosticsSlice';
import { AppDispatch } from '../store';
import { Upload, X, AlertTriangle, CheckCircle } from 'lucide-react';

const ImageAnalysis: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { language } = useSelector((state: RootState) => state.ui);
  const { selectedImage, isAnalyzing, currentResult, error } = useSelector(
    (state: RootState) => state.diagnostics
  );
  
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('bone_fracture');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadError(null);
      
      if (acceptedFiles.length === 0) {
        return;
      }
      
      const file = acceptedFiles[0];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setUploadError(
          language === 'en'
            ? 'Please upload an image file'
            : 'يرجى تحميل ملف صورة'
        );
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(
          language === 'en'
            ? 'File size should be less than 10MB'
            : 'يجب أن يكون حجم الملف أقل من 10 ميجابايت'
        );
        return;
      }
      
      // Store the file itself for API calls
      dispatch(setSelectedImage({ file, url: URL.createObjectURL(file) }));
    },
    [dispatch, language]
  );
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
  });
  
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  const handleAnalyzeImage = () => {
    if (selectedImage?.file) {
      dispatch(analyzeImage({ file: selectedImage.file, model: selectedModel }));
    }
  };
  
  const clearImage = () => {
    dispatch(setSelectedImage(null));
  };

  // Map model to display name
  const modelOptions = [
    { value: 'bone_fracture', label: language === 'en' ? 'Bone Fracture' : 'كسر العظام' },
    { value: 'lung_colon', label: language === 'en' ? 'Lung & Colon Cancer' : 'سرطان الرئة والقولون' },
    { value: 'monkeypox', label: language === 'en' ? 'Monkeypox' : 'جدري القرود' },
    { value: 'skin_cancer', label: language === 'en' ? 'Skin Cancer' : 'سرطان الجلد' },
    { value: 'tumor', label: language === 'en' ? 'Brain Tumor' : 'ورم الدماغ' },
    { value: 'xray', label: language === 'en' ? 'Chest X-ray' : 'أشعة الصدر' },
  ];

  // Placeholder severity and recommendations mapping
  const getResultDetails = (result: { condition: string; confidence: number }) => {
    const severityMap: { [key: string]: string } = {
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
      // Add descriptions based on your requirements or model documentation
      'Fractured': language === 'en' ? 'A fracture was detected in the bone.' : 'تم اكتشاف كسر في العظم.',
      'Not Fractured': language === 'en' ? 'No fracture detected.' : 'لم يتم اكتشاف كسر.',
      // Add similar descriptions for other classes
    };

    const recommendationsMap: { [key: string]: string[] } = {
      'Fractured': [
        language === 'en' ? 'Consult an orthopedic specialist immediately.' : 'استشر أخصائي عظام فورًا.',
        language === 'en' ? 'Avoid putting weight on the affected area.' : 'تجنب وضع وزن على المنطقة المصابة.',
      ],
      'Not Fractured': [
        language === 'en' ? 'Monitor for any pain or swelling.' : 'راقب أي ألم أو تورم.',
      ],
      // Add recommendations for other classes
    };

    return {
      condition: result.condition,
      confidence: result.confidence,
      severity: severityMap[result.condition] || 'medium',
      description: descriptionMap[result.condition] || (language === 'en' ? 'Analysis complete.' : 'اكتمل التحليل.'),
      recommendations: recommendationsMap[result.condition] || [
        language === 'en' ? 'Consult a healthcare professional for detailed diagnosis.' : 'استشر أخصائي رعاية صحية لتشخيص مفصل.',
      ],
    };
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {language === 'en' ? 'Medical Image Analysis' : 'تحليل الصور الطبية'}
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
          {language === 'en'
            ? 'Upload medical images such as X-rays, MRIs, or CT scans for AI-powered analysis and diagnosis.'
            : 'قم بتحميل الصور الطبية مثل الأشعة السينية أو التصوير بالرنين المغناطيسي أو الأشعة المقطعية للتحليل والتشخيص بواسطة الذكاء الاصطناعي.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
              {language === 'en' ? 'Select Analysis Type' : 'اختر نوع التحليل'}
            </label>
            <select
              value={selectedModel}
              onChange={handleModelChange}
              className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800 dark:border-neutral-700"
            >
              {modelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
              ${isDragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
              }
              ${selectedImage ? 'border-success-500 bg-success-50 dark:bg-success-900/20' : ''}
              ${uploadError ? 'border-error-500 bg-error-50 dark:bg-error-900/20' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            {selectedImage ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-success-500 mb-4" />
                <p className="text-success-600 dark:text-success-400 font-medium mb-2">
                  {language === 'en' ? 'Image uploaded successfully!' : 'تم تحميل الصورة بنجاح!'}
                </p>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4">
                  {language === 'en'
                    ? 'Click "Analyze Image" to process the image or drop a new image to replace.'
                    : 'انقر على "تحليل الصورة" لمعالجة الصورة أو قم بإسقاط صورة جديدة للاستبدال.'}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  className="text-neutral-600 dark:text-neutral-300 hover:text-error-500 dark:hover:text-error-400 text-sm flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  {language === 'en' ? 'Clear image' : 'مسح الصورة'}
                </button>
              </div>
            ) : uploadError ? (
              <div className="flex flex-col items-center">
                <AlertTriangle className="w-12 h-12 text-error-500 mb-4" />
                <p className="text-error-600 dark:text-error-400 font-medium mb-2">
                  {uploadError}
                </p>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                  {language === 'en'
                    ? 'Please try again with a valid image file.'
                    : 'يرجى المحاولة مرة أخرى باستخدام ملف صورة صالح.'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mb-4" />
                <p className="text-neutral-700 dark:text-neutral-200 font-medium mb-2">
                  {isDragActive
                    ? language === 'en'
                      ? 'Drop the image here...'
                      : 'أسقط الصورة هنا...'
                    : language === 'en'
                    ? 'Drag & drop an image, or click to select'
                    : 'اسحب وأفلت صورة، أو انقر للتحديد'}
                </p>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  {language === 'en'
                    ? 'Supported formats: JPG, PNG, GIF (max 10MB)'
                    : 'الصيغ المدعومة: JPG، PNG، GIF (الحد الأقصى 10 ميجابايت)'}
                </p>
              </div>
            )}
          </div>
          
          {selectedImage && (
            <div className="flex justify-center">
              <button
                onClick={handleAnalyzeImage}
                disabled={isAnalyzing}
                className="btn btn-primary w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {language === 'en' ? 'Analyzing...' : 'جاري التحليل...'}
                  </>
                ) : (
                  language === 'en' ? 'Analyze Image' : 'تحليل الصورة'
                )}
              </button>
            </div>
          )}
          
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">
              {language === 'en' ? 'Supported Image Types' : 'أنواع الصور المدعومة'}
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-primary-500">X</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-neutral-800 dark:text-white">
                    {language === 'en' ? 'X-Rays' : 'الأشعة السينية'}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {language === 'en'
                      ? 'Chest, bone, dental, and other X-ray images'
                      : 'صور الأشعة السينية للصدر والعظام والأسنان وغيرها'}
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-secondary-500">M</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-neutral-800 dark:text-white">
                    {language === 'en' ? 'MRI Scans' : 'صور الرنين المغناطيسي'}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {language === 'en'
                      ? 'Brain, spine, joint, and other MRI scans'
                      : 'صور الرنين المغناطيسي للدماغ والعمود الفقري والمفاصل وغيرها'}
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-accent-500">C</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-neutral-800 dark:text-white">
                    {language === 'en' ? 'CT Scans' : 'الأشعة المقطعية'}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {language === 'en'
                      ? 'Abdominal, head, chest, and other CT scan images'
                      : 'صور الأشعة المقطعية للبطن والرأس والصدر وغيرها'}
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-success-500">D</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-neutral-800 dark:text-white">
                    {language === 'en' ? 'Dermatology' : 'الأمراض الجلدية'}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {language === 'en'
                      ? 'Skin condition images, rashes, lesions, and moles'
                      : 'صور الحالات الجلدية والطفح الجلدي والآفات والشامات'}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div>
          {selectedImage && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold">
                  {language === 'en' ? 'Image Preview' : 'معاينة الصورة'}
                </h3>
              </div>
              <div className="p-4">
                <img
                  src={selectedImage.url}
                  alt="Uploaded medical image"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          )}
          
          {currentResult && (
            <div className="mt-6 bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold">
                  {language === 'en' ? 'Analysis Results' : 'نتائج التحليل'}
                </h3>
              </div>
              <div className="p-6">
                {(() => {
                  const resultDetails = getResultDetails({
                    condition: currentResult.result.condition,
                    confidence: currentResult.result.confidence,
                  });
                  return (
                    <>
                      <div className="flex items-center mb-4">
                        <div className={`w-3 h-3 rounded-full mr-2 
                          ${resultDetails.severity === 'high' ? 'bg-error-500' : 
                            resultDetails.severity === 'medium' ? 'bg-warning-500' : 'bg-success-500'}`}
                        ></div>
                        <h4 className="text-xl font-semibold">
                          {resultDetails.condition}
                        </h4>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-neutral-600 dark:text-neutral-300">
                            {language === 'en' ? 'Confidence' : 'الثقة'}
                          </span>
                          <span className="text-sm font-medium">
                            {(resultDetails.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${resultDetails.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="font-medium mb-2">
                          {language === 'en' ? 'Description' : 'الوصف'}
                        </h5>
                        <p className="text-neutral-600 dark:text-neutral-300">
                          {resultDetails.description}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">
                          {language === 'en' ? 'Recommendations' : 'التوصيات'}
                        </h5>
                        <ul className="space-y-2">
                          {resultDetails.recommendations.map((recommendation, index) => (
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
                    </>
                  );
                })()}
                
                <div className="mt-6 text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg">
                  <p>
                    {language === 'en'
                      ? 'Note: This analysis is for informational purposes only and is not a medical diagnosis. Please consult with a healthcare professional.'
                      : 'ملاحظة: هذا التحليل لأغراض إعلامية فقط وليس تشخيصًا طبيًا. يرجى استشارة أخصائي رعاية صحية.'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-6 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-xl p-4">
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
        </div>
      </div>
      
      <div className="mt-8 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-3 text-neutral-800 dark:text-white">
          {language === 'en' ? 'Privacy & Security' : 'الخصوصية والأمان'}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-300">
          {language === 'en'
            ? 'Your medical images are encrypted and securely processed. We do not store your images permanently and all analysis is done in compliance with healthcare privacy standards.'
            : 'يتم تشفير صورك الطبية ومعالجتها بشكل آمن. نحن لا نخزن صورك بشكل دائم ويتم إجراء جميع التحليلات وفقًا لمعايير خصوصية الرعاية الصحية.'}
        </p>
      </div>
    </div>
  );
};

export default ImageAnalysis;