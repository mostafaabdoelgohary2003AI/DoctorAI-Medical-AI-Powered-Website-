import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Activity, Image as ImageIcon, MessageSquare } from 'lucide-react';

const Diagnostics: React.FC = () => {
  const { language } = useSelector((state: RootState) => state.ui);

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {language === 'en' ? 'Medical Diagnostics' : 'التشخيص الطبي'}
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
          {language === 'en'
            ? 'Select a diagnostic tool to begin your health assessment.'
            : 'اختر أداة تشخيصية لبدء تقييم صحتك.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/image-analysis" className="card group hover:shadow-lg transition-all duration-300">
          <div className="h-48 bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center relative overflow-hidden">
            <ImageIcon className="w-20 h-20 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent">
              <h3 className="text-white text-xl font-semibold">
                {language === 'en' ? 'Medical Image Analysis' : 'تحليل الصور الطبية'}
              </h3>
            </div>
          </div>
          <div className="p-6">
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              {language === 'en'
                ? 'Upload X-rays, MRIs, CT scans, or other medical images for AI analysis.'
                : 'قم بتحميل الأشعة السينية أو التصوير بالرنين المغناطيسي أو الأشعة المقطعية أو غيرها من الصور الطبية للتحليل بالذكاء الاصطناعي.'}
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                <CheckIcon className="w-4 h-4 text-success-500 mr-2" />
                <span>
                  {language === 'en'
                    ? 'X-Ray Analysis'
                    : 'تحليل الأشعة السينية'}
                </span>
              </li>
              <li className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                <CheckIcon className="w-4 h-4 text-success-500 mr-2" />
                <span>
                  {language === 'en'
                    ? 'MRI Scan Analysis'
                    : 'تحليل التصوير بالرنين المغناطيسي'}
                </span>
              </li>
              <li className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                <CheckIcon className="w-4 h-4 text-success-500 mr-2" />
                <span>
                  {language === 'en'
                    ? 'CT Scan Analysis'
                    : 'تحليل الأشعة المقطعية'}
                </span>
              </li>
            </ul>
            <div className="flex items-center text-primary-500 font-medium group-hover:translate-x-2 transition-transform duration-300">
              <span>{language === 'en' ? 'Start Analysis' : 'بدء التحليل'}</span>
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </Link>
        
        <Link to="/symptom-checker" className="card group hover:shadow-lg transition-all duration-300">
          <div className="h-48 bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center relative overflow-hidden">
            <Activity className="w-20 h-20 text-secondary-500 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent">
              <h3 className="text-white text-xl font-semibold">
                {language === 'en' ? 'Symptom Checker' : 'فاحص الأعراض'}
              </h3>
            </div>
          </div>
          <div className="p-6">
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              {language === 'en'
                ? 'Use our interactive body map to identify symptoms and get diagnostic recommendations.'
                : 'استخدم خريطة الجسم التفاعلية لتحديد الأعراض والحصول على توصيات تشخيصية.'}
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                <CheckIcon className="w-4 h-4 text-success-500 mr-2" />
                <span>
                  {language === 'en'
                    ? 'Interactive Body Map'
                    : 'خريطة الجسم التفاعلية'}
                </span>
              </li>
              <li className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                <CheckIcon className="w-4 h-4 text-success-500 mr-2" />
                <span>
                  {language === 'en'
                    ? 'Symptom Severity Assessment'
                    : 'تقييم شدة الأعراض'}
                </span>
              </li>
              <li className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                <CheckIcon className="w-4 h-4 text-success-500 mr-2" />
                <span>
                  {language === 'en'
                    ? 'AI-Powered Recommendations'
                    : 'توصيات مدعومة بالذكاء الاصطناعي'}
                </span>
              </li>
            </ul>
            <div className="flex items-center text-secondary-500 font-medium group-hover:translate-x-2 transition-transform duration-300">
              <span>{language === 'en' ? 'Check Symptoms' : 'فحص الأعراض'}</span>
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </Link>
        
        <Link to="/chat" className="card group hover:shadow-lg transition-all duration-300">
          <div className="h-48 bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center relative overflow-hidden">
            <MessageSquare className="w-20 h-20 text-accent-500 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent">
              <h3 className="text-white text-xl font-semibold">
                {language === 'en' ? 'Medical Chat Assistant' : 'مساعد الدردشة الطبية'}
              </h3>
            </div>
          </div>
          <div className="p-6">
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              {language === 'en'
                ? 'Chat with our AI assistant about health concerns, symptoms, and medical questions.'
                : 'تحدث مع مساعد الذكاء الاصطناعي لدينا حول المخاوف الصحية والأعراض والأسئلة الطبية.'}
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                <CheckIcon className="w-4 h-4 text-success-500 mr-2" />
                <span>
                  {language === 'en'
                    ? 'Natural Language Processing'
                    : 'معالجة اللغة الطبيعية'}
                </span>
              </li>
              <li className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                <CheckIcon className="w-4 h-4 text-success-500 mr-2" />
                <span>
                  {language === 'en'
                    ? 'Medical Advice & Information'
                    : 'نصائح ومعلومات طبية'}
                </span>
              </li>
              <li className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                <CheckIcon className="w-4 h-4 text-success-500 mr-2" />
                <span>
                  {language === 'en'
                    ? 'Health Q&A'
                    : 'أسئلة وأجوبة صحية'}
                </span>
              </li>
            </ul>
            <div className="flex items-center text-accent-500 font-medium group-hover:translate-x-2 transition-transform duration-300">
              <span>{language === 'en' ? 'Start Chat' : 'بدء الدردشة'}</span>
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </Link>
      </div>
      
      <div className="mt-12 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <h3 className="text-xl md:text-2xl font-semibold mb-2">
              {language === 'en'
                ? 'Important Medical Disclaimer'
                : 'إخلاء مسؤولية طبية مهمة'}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300">
              {language === 'en'
                ? 'DoctorAI is designed to provide information and suggestions, not to replace professional medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment of any medical condition.'
                : 'تم تصميم دكتوري لتقديم المعلومات والاقتراحات، وليس لاستبدال المشورة الطبية المهنية. استشر دائمًا مقدم رعاية صحية مؤهل لتشخيص وعلاج أي حالة طبية.'}
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center md:justify-end">
            <Link to="/disclaimer" className="btn btn-outline">
              {language === 'en' ? 'Learn More' : 'تعرف على المزيد'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Diagnostics;