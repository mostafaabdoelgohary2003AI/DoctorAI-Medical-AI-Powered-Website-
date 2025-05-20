import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Heart, Shield, FileText, Info } from 'lucide-react';

const Footer: React.FC = () => {
  const { language } = useSelector((state: RootState) => state.ui);
  
  return (
    <footer className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 mt-auto">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <svg className="w-8 h-8 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6H9C7.34315 6 6 7.34315 6 9V16C6 17.6569 7.34315 19 9 19H16C17.6569 19 19 17.6569 19 16V9C19 7.34315 17.6569 6 16 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 14C9.32843 14 10 13.3284 10 12.5C10 11.6716 9.32843 11 8.5 11C7.67157 11 7 11.6716 7 12.5C7 13.3284 7.67157 14 8.5 14Z" fill="currentColor"/>
                <path d="M15.5 14C16.3284 14 17 13.3284 17 12.5C17 11.6716 16.3284 11 15.5 11C14.6716 11 14 11.6716 14 12.5C14 13.3284 14.6716 14 15.5 14Z" fill="currentColor"/>
                <path d="M10 16H14V15C14 14.4477 13.5523 14 13 14H11C10.4477 14 10 14.4477 10 15V16Z" fill="currentColor"/>
                <path d="M12 6V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="ml-2 text-xl font-semibold text-neutral-800 dark:text-white">
                {language === 'en' ? 'DoctorAI' : 'دكتوري'}
              </span>
            </Link>
            <p className="mt-4 text-neutral-600 dark:text-neutral-300">
              {language === 'en'
                ? 'Advanced AI-powered medical diagnostic platform for symptom analysis and health recommendations.'
                : 'منصة تشخيص طبي متقدمة مدعومة بالذكاء الاصطناعي لتحليل الأعراض وتقديم توصيات صحية.'}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-white">
              {language === 'en' ? 'Features' : 'الميزات'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/diagnostics"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {language === 'en' ? 'Diagnostics' : 'التشخيص'}
                </Link>
              </li>
              <li>
                <Link
                  to="/image-analysis"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {language === 'en' ? 'Image Analysis' : 'تحليل الصور'}
                </Link>
              </li>
              <li>
                <Link
                  to="/symptom-checker"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {language === 'en' ? 'Symptom Checker' : 'فاحص الأعراض'}
                </Link>
              </li>
              <li>
                <Link
                  to="/health-guides"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {language === 'en' ? 'Health Guides' : 'أدلة صحية'}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-white">
              {language === 'en' ? 'Resources' : 'موارد'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {language === 'en' ? 'About Us' : 'من نحن'}
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {language === 'en' ? 'Blog' : 'المدونة'}
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {language === 'en' ? 'FAQ' : 'الأسئلة الشائعة'}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {language === 'en' ? 'Contact Us' : 'اتصل بنا'}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-white">
              {language === 'en' ? 'Legal' : 'قانوني'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
                </Link>
              </li>
              <li>
                <Link
                  to="/compliance"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {language === 'en' ? 'HIPAA Compliance' : 'الامتثال لـ HIPAA'}
                </Link>
              </li>
              <li>
                <Link
                  to="/disclaimer"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {language === 'en' ? 'Medical Disclaimer' : 'إخلاء المسؤولية الطبية'}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Link
                to="/privacy"
                className="flex items-center text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
              >
                <Shield size={16} className="mr-1" />
                <span className="text-sm">{language === 'en' ? 'Privacy' : 'الخصوصية'}</span>
              </Link>
              <Link
                to="/terms"
                className="flex items-center text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
              >
                <FileText size={16} className="mr-1" />
                <span className="text-sm">{language === 'en' ? 'Terms' : 'الشروط'}</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
              >
                <Info size={16} className="mr-1" />
                <span className="text-sm">{language === 'en' ? 'About' : 'عن'}</span>
              </Link>
            </div>
            
            <div className="text-neutral-600 dark:text-neutral-300 text-sm flex items-center">
              <span>
                {language === 'en'
                  ? '© 2025 DoctorAI. Made with'
                  : '© 2025 دكتوري. صنع بـ'}
              </span>
              <Heart size={16} className="mx-1 text-error-500" fill="currentColor" />
              <span>
                {language === 'en'
                  ? 'for better healthcare'
                  : 'لرعاية صحية أفضل'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;