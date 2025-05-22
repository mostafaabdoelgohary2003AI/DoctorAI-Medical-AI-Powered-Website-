import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Home, Search, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  const { language } = useSelector((state: RootState) => state.ui);
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-24 h-24 rounded-full bg-error-100 dark:bg-error-900/30 flex items-center justify-center mb-8">
        <AlertTriangle size={48} className="text-error-500" />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold text-neutral-800 dark:text-white mb-4 text-center">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-neutral-700 dark:text-neutral-200 mb-6 text-center">
        {language === 'en' ? 'Page Not Found' : 'الصفحة غير موجودة'}
      </h2>
      <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-md text-center mb-8">
        {language === 'en'
          ? 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
          : 'الصفحة التي تبحث عنها ربما تمت إزالتها أو تغيير اسمها أو أنها غير متاحة مؤقتًا.'}
      </p>
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <Link to="/" className="btn btn-primary">
          <Home size={18} className="mr-2" />
          {language === 'en' ? 'Back to Home' : 'العودة إلى الصفحة الرئيسية'}
        </Link>
        <Link to="/diagnostics" className="btn btn-outline">
          <Search size={18} className="mr-2" />
          {language === 'en' ? 'Try Diagnostics' : 'جرب التشخيصات'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;