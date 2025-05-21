import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  Stethoscope, 
  Image as ImageIcon, 
  Activity, 
  Shield, 
  Zap, 
  Users, 
  Clock,
  HeartPulse,
  BrainCircuit
} from 'lucide-react';

const Home: React.FC = () => {
  const { language } = useSelector((state: RootState) => state.ui);

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-primary-50 dark:from-neutral-800 dark:to-primary-900/20 rounded-3xl">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {language === 'en' ? (
                  <>
                    AI-Powered <span className="text-primary-500">Medical Diagnostics</span> For Everyone
                  </>
                ) : (
                  <>
                    تشخيص طبي <span className="text-primary-500">بالذكاء الاصطناعي</span> للجميع
                  </>
                )}
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
                {language === 'en'
                  ? 'Get instant medical insights from our advanced AI system. Upload medical images, check symptoms, or chat with our AI for personalized health recommendations.'
                  : 'احصل على رؤى طبية فورية من نظام الذكاء الاصطناعي المتقدم لدينا. قم بتحميل الصور الطبية، أو فحص الأعراض، أو الدردشة مع الذكاء الاصطناعي للحصول على توصيات صحية مخصصة.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/diagnostics" className="btn btn-primary">
                  {language === 'en' ? 'Try Diagnostics' : 'جرب التشخيص'}
                </Link>
                <Link to="/about" className="btn btn-outline">
                  {language === 'en' ? 'Learn More' : 'تعرف على المزيد'}
                </Link>
              </div>
              
              <div className="flex items-center mt-8">
                <div className="flex -space-x-2">
                  <img 
                    src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1" 
                    alt="User" 
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-800"
                  />
                  <img 
                    src="https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1" 
                    alt="User" 
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-800"
                  />
                  <img 
                    src="https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1" 
                    alt="User" 
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-800"
                  />
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-accent-500 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                        </svg>
                      ))}
                    </div>
                    <p className="ml-1 text-sm text-neutral-600 dark:text-neutral-300">
                      {language === 'en' ? '4.9 (2.5k+ users)' : '4.9 (أكثر من 2.5 ألف مستخدم)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative">
              <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-xl overflow-hidden relative z-10">
                <img
                  src="https://images.pexels.com/photos/7578686/pexels-photo-7578686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
                  alt="AI Medical Analysis"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <p className="font-medium">
                      {language === 'en'
                        ? 'Advanced medical imaging analysis powered by AI'
                        : 'تحليل متقدم للتصوير الطبي مدعوم بالذكاء الاصطناعي'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-4 -bottom-4 bg-primary-500 text-white p-4 rounded-lg shadow-lg z-20 max-w-xs animate-pulse-slow">
                <div className="flex items-start">
                  <BrainCircuit className="w-10 h-10 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {language === 'en' ? 'AI Analysis' : 'تحليل الذكاء الاصطناعي'}
                    </h3>
                    <p className="text-sm text-primary-100">
                      {language === 'en'
                        ? 'Our models are trained on millions of medical images for high accuracy diagnostics.'
                        : 'تم تدريب نماذجنا على ملايين الصور الطبية للتشخيص عالي الدقة.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -left-4 top-1/4 bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-lg z-20 max-w-xs animate-slide-in-right">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                    <CheckMarkIcon className="w-6 h-6 text-success-500" />
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    {language === 'en'
                      ? '98.7% diagnostic accuracy rate'
                      : 'معدل دقة التشخيص 98.7٪'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'en'
                ? 'Advanced AI Diagnostics at Your Fingertips'
                : 'تشخيصات الذكاء الاصطناعي المتقدمة في متناول يديك'}
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              {language === 'en'
                ? 'Our platform offers multiple AI-powered diagnostic tools to help you understand your health better.'
                : 'توفر منصتنا أدوات تشخيص متعددة مدعومة بالذكاء الاصطناعي لمساعدتك على فهم صحتك بشكل أفضل.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
                <ImageIcon className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-white">
                {language === 'en' ? 'Image Analysis' : 'تحليل الصور'}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                {language === 'en'
                  ? 'Upload X-rays, MRIs, CT scans, or other medical images for instant AI analysis and insights.'
                  : 'قم بتحميل الأشعة السينية أو التصوير بالرنين المغناطيسي أو الأشعة المقطعية أو غيرها من الصور الطبية للتحليل الفوري بالذكاء الاصطناعي.'}
              </p>
              <Link
                to="/image-analysis"
                className="text-primary-500 hover:text-primary-600 font-medium inline-flex items-center"
              >
                <span>{language === 'en' ? 'Try Now' : 'جرب الآن'}</span>
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            
            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center mb-6">
                <Activity className="w-7 h-7 text-secondary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-white">
                {language === 'en' ? 'Symptom Checker' : 'فاحص الأعراض'}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                {language === 'en'
                  ? 'Describe your symptoms using our interactive body map and get preliminary diagnostic suggestions.'
                  : 'صف أعراضك باستخدام خريطة الجسم التفاعلية لدينا واحصل على اقتراحات تشخيصية أولية.'}
              </p>
              <Link
                to="/symptom-checker"
                className="text-secondary-500 hover:text-secondary-600 font-medium inline-flex items-center"
              >
                <span>{language === 'en' ? 'Try Now' : 'جرب الآن'}</span>
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            
            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mb-6">
                <Stethoscope className="w-7 h-7 text-accent-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-white">
                {language === 'en' ? 'Medical Chatbot' : 'روبوت الدردشة الطبي'}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                {language === 'en'
                  ? 'Chat with our AI assistant to answer questions about symptoms, medications, and general health concerns.'
                  : 'تحدث مع مساعد الذكاء الاصطناعي للإجابة عن الأسئلة المتعلقة بالأعراض والأدوية والمخاوف الصحية العامة.'}
              </p>
              <Link
                to="/chat"
                className="text-accent-500 hover:text-accent-600 font-medium inline-flex items-center"
              >
                <span>{language === 'en' ? 'Try Now' : 'جرب الآن'}</span>
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Indicators Section */}
      <section className="section bg-neutral-50 dark:bg-neutral-800 rounded-3xl">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'en'
                ? 'Trusted by Healthcare Professionals'
                : 'موثوق به من قبل المتخصصين في الرعاية الصحية'}
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              {language === 'en'
                ? 'Our platform meets the highest standards for medical data security and diagnostic accuracy.'
                : 'تلبي منصتنا أعلى المعايير لأمان البيانات الطبية ودقة التشخيص.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-800 dark:text-white">
                {language === 'en' ? 'HIPAA Compliant' : 'متوافق مع HIPAA'}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                {language === 'en'
                  ? 'Secure, encrypted, and fully compliant with healthcare privacy standards.'
                  : 'آمن ومشفر ومتوافق تمامًا مع معايير خصوصية الرعاية الصحية.'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-secondary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-800 dark:text-white">
                {language === 'en' ? '99.8% Uptime' : '99.8% وقت التشغيل'}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                {language === 'en'
                  ? 'Reliable service available when you need it most.'
                  : 'خدمة موثوقة متاحة عندما تحتاج إليها أكثر.'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-800 dark:text-white">
                {language === 'en' ? '500+ Doctors' : '+500 طبيب'}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                {language === 'en'
                  ? 'Medical professionals use and trust our platform.'
                  : 'المتخصصون الطبيون يستخدمون منصتنا ويثقون بها.'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-success-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-800 dark:text-white">
                {language === 'en' ? '3s Response Time' : '3 ثوان وقت الاستجابة'}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                {language === 'en'
                  ? 'Fast diagnostic processing for immediate results.'
                  : 'معالجة تشخيصية سريعة للحصول على نتائج فورية.'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" 
              alt="Microsoft" 
              className="h-6 md:h-10 dark:invert" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
              alt="Google" 
              className="h-6 md:h-10 dark:invert" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
              alt="Amazon" 
              className="h-6 md:h-10 dark:invert" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" 
              alt="Apple" 
              className="h-6 md:h-10 dark:invert" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg" 
              alt="AMD" 
              className="h-6 md:h-10 dark:invert" 
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section bg-primary-500 text-white rounded-3xl">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-3/5">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {language === 'en'
                  ? 'Ready to experience the future of healthcare?'
                  : 'هل أنت مستعد لتجربة مستقبل الرعاية الصحية؟'}
              </h2>
              <p className="text-lg text-primary-100 mb-6">
                {language === 'en'
                  ? 'Join thousands of users who trust DoctorAI for fast, accurate medical insights.'
                  : 'انضم إلى آلاف المستخدمين الذين يثقون بـ دكتوري للحصول على رؤى طبية سريعة ودقيقة.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn bg-white text-primary-500 hover:bg-primary-50">
                  {language === 'en' ? 'Start for Free' : 'ابدأ مجانًا'}
                </Link>
                <Link to="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-500">
                  {language === 'en' ? 'Contact Us' : 'اتصل بنا'}
                </Link>
              </div>
            </div>
            
            <div className="lg:w-2/5 flex justify-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 bg-white p-4 rounded-lg shadow-lg z-20 animate-pulse-slow">
                  <div className="flex items-center">
                    <HeartPulse className="w-8 h-8 text-error-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-neutral-800">
                        {language === 'en' ? 'Health Tracker' : 'متتبع الصحة'}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {language === 'en' ? 'Heart rate: 75 BPM' : 'معدل ضربات القلب: 75 نبضة في الدقيقة'}
                      </p>
                    </div>
                  </div>
                </div>
                <img
                  src="https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Mobile app"
                  className="w-64 rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const CheckMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Home;