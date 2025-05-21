import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Navigate, Link } from 'react-router-dom';
import { Activity, Clock, Calendar, FileText, Settings, ExternalLink } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { language } = useSelector((state: RootState) => state.ui);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { results } = useSelector((state: RootState) => state.diagnostics);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === 'en'
              ? `Welcome, ${user?.name}`
              : `مرحبًا، ${user?.name}`}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            {language === 'en'
              ? 'Here is an overview of your health activity and diagnostic history.'
              : 'إليك نظرة عامة على نشاطك الصحي وتاريخ التشخيص.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/diagnostics" className="btn btn-primary">
            <Activity className="w-4 h-4 mr-2" />
            {language === 'en' ? 'New Diagnostic' : 'تشخيص جديد'}
          </Link>
          <Link to="/appointments" className="btn btn-outline">
            <Calendar className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Book Appointment' : 'حجز موعد'}
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">
                {language === 'en' ? 'Diagnostic Sessions' : 'جلسات التشخيص'}
              </p>
              <h3 className="text-2xl font-bold">{results.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1 rounded-full">
              <div
                className="bg-primary-500 h-1 rounded-full"
                style={{ width: `${Math.min(results.length * 10, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              {language === 'en'
                ? `${results.length} of 10 free diagnostics used`
                : `تم استخدام ${results.length} من 10 تشخيصات مجانية`}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">
                {language === 'en' ? 'Last Activity' : 'آخر نشاط'}
              </p>
              <h3 className="text-lg font-semibold">
                {results.length > 0
                  ? results[0].diagnosisType === 'imaging'
                    ? language === 'en'
                      ? 'Image Analysis'
                      : 'تحليل الصورة'
                    : language === 'en'
                    ? 'Symptom Check'
                    : 'فحص الأعراض'
                  : language === 'en'
                  ? 'No activity yet'
                  : 'لا يوجد نشاط بعد'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-secondary-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {results.length > 0
                ? formatDate(results[0].timestamp)
                : language === 'en'
                ? 'Start your first diagnostic'
                : 'ابدأ تشخيصك الأول'}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">
                {language === 'en' ? 'Account Status' : 'حالة الحساب'}
              </p>
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'Basic Account' : 'حساب أساسي'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
              <Settings className="w-5 h-5 text-accent-500" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/upgrade"
              className="text-primary-500 dark:text-primary-400 text-sm font-medium hover:underline flex items-center"
            >
              <span>
                {language === 'en' ? 'Upgrade to Premium' : 'الترقية إلى المميز'}
              </span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {language === 'en' ? 'Recent Diagnostics' : 'التشخيصات الأخيرة'}
          </h2>
          <Link
            to="/history"
            className="text-primary-500 dark:text-primary-400 text-sm font-medium hover:underline"
          >
            {language === 'en' ? 'View All' : 'عرض الكل'}
          </Link>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden">
          {results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-900/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      {language === 'en' ? 'Type' : 'النوع'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      {language === 'en' ? 'Result' : 'النتيجة'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      {language === 'en' ? 'Confidence' : 'الثقة'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      {language === 'en' ? 'Date' : 'التاريخ'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      {language === 'en' ? 'Action' : 'الإجراء'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {results.slice(0, 5).map((result) => (
                    <tr key={result.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                            ${result.diagnosisType === 'imaging' 
                              ? 'bg-primary-100 dark:bg-primary-900/30' 
                              : 'bg-secondary-100 dark:bg-secondary-900/30'}`}
                          >
                            {result.diagnosisType === 'imaging' ? (
                              <svg className="w-4 h-4 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : (
                              <Activity className="w-4 h-4 text-secondary-500" />
                            )}
                          </div>
                          <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-200">
                            {result.diagnosisType === 'imaging'
                              ? language === 'en'
                                ? 'Image Analysis'
                                : 'تحليل الصورة'
                              : language === 'en'
                              ? 'Symptom Check'
                              : 'فحص الأعراض'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${result.result.severity === 'high'
                            ? 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300'
                            : result.result.severity === 'medium'
                            ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300'
                            : 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300'}`}
                        >
                          {result.result.condition}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                result.result.confidence > 0.8
                                  ? 'bg-success-500'
                                  : result.result.confidence > 0.6
                                  ? 'bg-warning-500'
                                  : 'bg-error-500'
                              }`}
                              style={{ width: `${result.result.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {(result.result.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                        {formatDate(result.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/result/${result.id}`}
                          className="text-primary-500 dark:text-primary-400 hover:underline"
                        >
                          {language === 'en' ? 'View' : 'عرض'}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2">
                {language === 'en' ? 'No diagnostics yet' : 'لا توجد تشخيصات بعد'}
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-6">
                {language === 'en'
                  ? 'Start your first diagnostic to get personalized health insights.'
                  : 'ابدأ تشخيصك الأول للحصول على رؤى صحية مخصصة.'}
              </p>
              <Link to="/diagnostics" className="btn btn-primary">
                {language === 'en' ? 'Start Diagnostic' : 'بدء التشخيص'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;